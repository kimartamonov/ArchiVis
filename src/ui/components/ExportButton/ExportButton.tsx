export interface ExportButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ExportButton({ label, onClick, disabled = false }: ExportButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.btn,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      {label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  btn: {
    background: 'var(--accent-bg, rgba(170,59,255,0.1))',
    border: '1px solid var(--accent-border, rgba(170,59,255,0.5))',
    borderRadius: 6,
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--accent, #aa3bff)',
  },
  disabled: {
    opacity: 0.4,
    cursor: 'default',
  },
};
