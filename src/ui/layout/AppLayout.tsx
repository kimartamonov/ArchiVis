import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  return (
    <div style={styles.layout}>
      <Sidebar />
      <main style={styles.content}>{children}</main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    height: '100vh',
    width: '100%',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
};
