# 🩺 Heallense  
**Your Health, Decoded — Powered by Responsible AI**

Heallense is a browser-based AI wellness assistant designed to help users understand health conditions, medicines, and daily wellness habits using **trusted medical sources**, while strictly maintaining **safety, privacy, and ethical boundaries**.

---

## 🚀 What Heallense Does

Heallense helps users:
- 📘 Understand common **health conditions and symptoms**
- 💊 Learn **what medicines are commonly used for** (without prescriptions or dosages)
- 🧠 Get wellness insights related to stress, sleep, and lifestyle
- ⏰ Maintain healthy routines through **smart reminders**
- 🔐 Keep health data secure with **Firebase Authentication & Firestore**

Heallense is **educational, not diagnostic**, and always encourages consulting healthcare professionals.

---

## 🛡️ Safety First Design

Heallense is built with strict boundaries:
- ❌ No disease diagnosis  
- ❌ No medicine prescriptions or dosages  
- ❌ No replacement for doctors  

✅ Uses only **trusted sources** (WHO, NHS, MedlinePlus)  
✅ Displays clear medical disclaimers  
✅ Encourages professional consultation at all times  

---

## 🧠 How the AI Works

Heallense uses a **retrieval-based AI approach**:
1. User asks a health or medicine-related question
2. The system searches a curated knowledge base (JSON)
3. Only verified information is returned
4. If no data exists, the AI safely refuses to answer

This avoids hallucinations common in general-purpose AI tools.

---

## 📊 Knowledge Coverage

- 🧠 **140+ health conditions**
- 💊 **140+ medicines**
- 📚 All sourced from trusted medical authorities
- 🛡️ Zero unsafe advice

---

## 🧱 Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Authentication:** Firebase Auth (Email & Google)  
- **Database:** Firebase Firestore  
- **AI Logic:** Retrieval-based (RAG-style, frontend)  
- **Hosting:** Firebase Hosting / Static Hosting  

---

## ⏰ Smart Reminders

Heallense includes **intelligent default reminders**:
- Hydration reminders
- Breathing & wellness breaks
- User-controlled timing and frequency

If users forget to configure reminders, Heallense enables gentle defaults automatically.

---

## 🧪 How to Run Locally

```bash
# Option 1
Use VS Code Live Server

# Option 2
python -m http.server

--

Sample Questions to Ask Heallense AI
🦠 Disease & Symptoms

What is asthma and what are its common symptoms?

Explain diabetes in simple terms.

What causes high blood pressure?

What are the early symptoms of dengue fever?

What is anemia and who is at risk?

Explain migraine and its triggers.

What is bronchitis?

Difference between viral fever and bacterial infection.

What is thyroid disorder?

What are common signs of dehydration?

💊 Medicines (Safe & Informational)

What is the use of Dolo 650?

What does paracetamol do?

When is ibuprofen generally used?

What is ORS and why is it important?

What is the use of cetirizine?

What does amoxicillin treat? (general info)

What is insulin used for?

What is antacid medicine used for?

What is saline?

What is the use of vitamin D supplements?

⚠️ The AI provides educational information only
⚠️ Always consult a doctor before consuming any medicine.