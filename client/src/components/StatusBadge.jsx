function StatusBadge({ estado }) {
  return (
    <span className={`badge ${estado.replace(' ', '-')}`}>
      {estado}
    </span>
  );
}

export default StatusBadge;