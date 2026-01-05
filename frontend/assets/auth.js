(function () {
  /* ================= FIREBASE CONFIG ================= */
  const firebaseConfig = {
    apiKey: "AIzaSyBd6RIP1EAuo6RLTOR3kkALYLasCezL-tM",
    authDomain: "heallense.firebaseapp.com",
    projectId: "heallense",
    storageBucket: "heallense.firebasestorage.app",
    messagingSenderId: "278969011906",
    appId: "1:278969011906:web:d038ca58df6c63d127355b"
  };

  if (!window.firebase) {
    console.error("Firebase SDK not loaded");
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  /* ================= HELPERS ================= */
  const id = (i) => document.getElementById(i);

  const show = (el, msg) => {
    if (!el) return;
    el.style.display = msg ? "block" : "none";
    el.textContent = msg || "";
  };

  const busy = (btn, on, txt) => {
    if (!btn) return;
    if (!btn._orig) btn._orig = btn.textContent;
    btn.disabled = on;
    btn.textContent = on ? txt || "Please wait…" : btn._orig;
  };

  const friendlyError = (ex) => {
    if (!ex) return "Something went wrong.";
    switch (ex.code) {
      case "auth/email-already-in-use": return "This email is already registered.";
      case "auth/invalid-email": return "Invalid email address.";
      case "auth/weak-password": return "Password is too weak.";
      case "auth/user-not-found": return "No account found.";
      case "auth/wrong-password": return "Incorrect password.";
      case "auth/popup-blocked": return "Popup blocked. Allow popups.";
      default: return ex.message || "Authentication failed.";
    }
  };

  /* ================= PASSWORD STRENGTH ================= */
  const scorePassword = (pw) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 5);
  };

  /* ================= SIGNUP ================= */
  const signupForm = id("signupForm");
  if (signupForm) {
    const pw = signupForm.querySelector("#password");
    const bar = id("passwordStrengthBar");
    const lbl = id("passwordStrengthLabel");

    pw?.addEventListener("input", () => {
      const s = scorePassword(pw.value);
      if (bar) {
        bar.style.width = (s / 5) * 100 + "%";
        bar.style.background = s >= 4 ? "#10b981" : s >= 2 ? "#f59e0b" : "#ef4444";
      }
      if (lbl) lbl.textContent = pw.value ? ["Weak", "Fair", "Good", "Strong", "Very strong"][s - 1] || "" : "";
    });

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = id("formError"); show(err);

      const name = signupForm.name.value.trim();
      const email = signupForm.email.value.trim();
      const pass = signupForm.password.value;
      const conf = signupForm.confirmPassword.value;

      if (!name) return show(err, "Enter your name.");
      if (!email) return show(err, "Enter your email.");
      if (pass.length < 6) return show(err, "Password must be 6+ characters.");
      if (pass !== conf) return show(err, "Passwords do not match.");

      const btn = signupForm.querySelector("[type=submit]");

      try {
        busy(btn, true, "Creating…");
        const r = await auth.createUserWithEmailAndPassword(email, pass);

        await db.collection("user").doc(r.user.uid).set({
          name,
          email,
          provider: "email",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        // persist name locally so dashboard shows it immediately after redirect
        try{ localStorage.setItem('realName', name); }catch(e){}
        location.href = "dashboard.html";
      } catch (ex) {
        show(err, friendlyError(ex));
      } finally {
        busy(btn, false);
      }
    });
  }

  /* ================= LOGIN ================= */
  const loginForm = id("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const err = id("formError"); show(err);

      const email = loginForm.email.value.trim();
      const pass = loginForm.password.value;

      if (!email || !pass) return show(err, "Email and password required.");

      const btn = loginForm.querySelector("[type=submit]");

      try {
        busy(btn, true, "Signing in…");
        const r = await auth.signInWithEmailAndPassword(email, pass);

        await db.collection("user").doc(r.user.uid).update({
          lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Fetch the user's name and persist locally for immediate UI
        try{
          const snap = await db.collection('user').doc(r.user.uid).get();
          if(snap.exists && snap.data && snap.data().name){
            localStorage.setItem('realName', snap.data().name);
          }
        }catch(e){/* ignore */}

        location.href = "dashboard.html";
      } catch (ex) {
        show(err, friendlyError(ex));
      } finally {
        busy(btn, false);
      }
    });
  }

  /* ================= GOOGLE AUTH ================= */
  const processGoogle = async (r) => {
    const ref = db.collection("user").doc(r.user.uid);
    const snap = await ref.get();

    let name = r.user.displayName || "";
    if (!name) name = prompt("What should we call you?") || "User";

    await ref.set({
      name,
      email: r.user.email,
      provider: "google",
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: snap.exists ? snap.data().createdAt : firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // persist name locally for immediate UI after redirect
    try{ localStorage.setItem('realName', name); }catch(e){}

    location.href = "dashboard.html";
  };

  const handleGoogle = async (btn) => {
    const err = id("formError"); show(err);
    try {
      busy(btn, true, "Signing…");
      const p = new firebase.auth.GoogleAuthProvider();
      const r = await auth.signInWithPopup(p);
      await processGoogle(r);
    } catch (ex) {
      show(err, friendlyError(ex));
    } finally {
      busy(btn, false);
    }
  };

  id("googleSignup")?.addEventListener("click", e => handleGoogle(e.target));
  id("googleLogin")?.addEventListener("click", e => handleGoogle(e.target));

  /* ================= PASSWORD TOGGLE ================= */
  document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("toggle-pass")) return;
    const input = e.target.parentElement.querySelector("input");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    e.target.textContent = input.type === "password" ? "Show" : "Hide";
  });

})();
