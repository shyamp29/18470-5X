import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordInput = ({ id, name, value, onChange, placeholder, autoComplete, style = {}, inputStyle = {} }) => {
  const [visible, setVisible] = useState(false);

  const wrapper = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    padding: "14px 16px",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--color-input-bg)",
    border: "1px solid var(--color-input-border)",
    ...style,
  };

  const field = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "var(--font-size-lg)",
    color: "var(--color-text-near-black)",
    ...inputStyle,
  };

  return (
    <div style={wrapper}>
      <FaLock size={16} color="var(--color-text-muted)" title="Password" />
      <input
        id={id}
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={field}
      />
      <span
        onClick={() => setVisible(v => !v)}
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        title={visible ? "Hide password" : "Show password"}
      >
        {visible
          ? <AiOutlineEyeInvisible size={20} color="var(--color-text-muted)" />
          : <AiOutlineEye size={20} color="var(--color-text-muted)" />
        }
      </span>
    </div>
  );
};

export default PasswordInput;
