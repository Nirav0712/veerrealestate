"use client";

import { useState, FormEvent, ChangeEvent } from "react";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful");
        setForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="/images/veer-logo.png"
          alt="Logo"
          className="text-center mx-auto mb-6 items-center text-align-center h-22 w-32"
        />
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Your ideal property is just one step away.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #557eea, #764ba2)  ",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    width: "380px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#111827",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s",
  },
};
