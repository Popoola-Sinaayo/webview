import styles from "./page.module.css";
import LoadingIcons from "react-loading-icons";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LoadingIcons.TailSpin stroke="#7216F3" strokeWidth={2} />
      </main>
    </div>
  );
}
