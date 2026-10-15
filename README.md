# Society Event Booking System

**Society Event Booking System** is a **web application** that helps users manage societies, discover and participate in events, create event drafts (by society leads), and approve events (by society presidents) through a **simple, user-friendly interface**.

Built with **React**, **TailwindCSS**, **Radix UI**, and **Redux Toolkit** for a modern, responsive experience.

---

## 🔹 Roles and Features

### 👤 User
- View all events and societies.
- Check event details, location, date, and registration status.
- Register for and cancel registration from events.
- Submit feedback and ratings for events.
- Join a society using its **join code**.

### 👥 Society Member
*(includes all User features)*
- View **drafts** of their own society.
- View **draft details** (`getDraftInfo`).
- View **draft history** (`getDraftHistory`).
- Access is restricted to **their own society only**.

### 📝 Society Lead
*(includes all User features)*
- Create **event drafts** for approval.
- Update a draft: updating creates a **new draft version**, and the previous version is saved in the draft history.
- Track draft history and event approval status.

### ✅ Society President
*(includes all User features)*
- Approve or reject event drafts.
- View registered users for each event.

### 🛠️ Admin
*(includes all User features)*
- Create societies.
- Assign a **lead** to a society.
- Assign a **president** to a society.
- View all societies and events.
- View the **members** of any society.

### 🔔 General
- Notifications for actions (feedback submitted, draft created, etc.) using **Sonner**.
- Fully **responsive UI** with TailwindCSS.
- Accessible components (dialogs, selects, tooltips, badges) using **Radix UI**.

---

## 🔹 Event Workflow

```
Lead creates draft → President approves / rejects → Approved event goes live → Users register & give feedback
         ↑                                  │
         └── Lead edits (new version) ◄─────┘   (older versions kept in draft history)
```

---

## 🔹 Tech Stack

- **Frontend:** React 19, React DOM
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Form Handling:** React Hook Form
- **UI Components:** Radix UI, Lucide React Icons
- **Styling:** TailwindCSS, Tailwind Merge
- **HTTP Requests:** Axios
- **Animations & Alerts:** Sonner, tw-animate-css
- **Bundler & Dev Tools:** Vite, ESLint
