export function Banner({ type = 'muted', children }) {
  const classes =
    type === 'error'
      ? 'alert alert-warning shadow'
      : type === 'success'
      ? 'alert alert-success shadow'
      : 'alert shadow';
  return <div className={classes}>{children}</div>;
}
