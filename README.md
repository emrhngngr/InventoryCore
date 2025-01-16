# 🛡️ ISO 27001 Compliant Inventory Management System  

This project is a **dynamic, user-friendly inventory management system** designed in compliance with **ISO 27001 security standards**. Built using the **MERN Stack**, it includes **asset management, task assignment, risk assessment, and role-based access control**.  

---

## 📌 Features  

✅ **Dynamic Asset Management**  
- Three different **categories** (system_group, a_group, software_group).  
- **Custom attributes per category** (add, update, delete dynamically).  

✅ **Role-Based Task Management**  
- **Admin** manages users, assigns tasks, and has full system access.  
- **Other roles** have restricted access based on permissions.  
- Tasks are **assigned to users** and require **admin approval upon completion**.  

✅ **Risk & Security Management**  
- Graphical representation of **criticality and confidentiality levels** of assets.  
- If tasks are delayed, **risk levels increase dynamically**.  

✅ **Weekly Update Tracking**  
- Newly added assets **must be updated weekly**, or users receive alerts.  
- **Switch-based control** allows enabling/disabling this feature.  

✅ **Secure User Authentication**  
- **JWT tokens** for session management.  
- **Bcrypt encryption** for storing user passwords.  

---

## 🛠️ Tech Stack  

| Technology  | Description  |
|------------|-------------|
| **MongoDB** | NoSQL database with dynamic schema support |
| **Express.js** | Backend API development |
| **React.js** | Frontend UI framework |
| **Node.js** | Backend server runtime |
| **Tailwind CSS** | Modern UI styling |
| **JWT** | Secure authentication and session handling |
| **Bcrypt** | Password hashing for security |

---
