import { useProgress } from "@react-three/drei";
import React, { useEffect, useState } from "react";

interface CustomLoaderProps {
  isUploading?: boolean;
}

export function CustomLoader({ isUploading = false }: CustomLoaderProps) {
  const { progress, active } = useProgress();
  const [shown, setShown] = useState(true);

  const isBusy = active || isUploading;

  useEffect(() => {
    if (isBusy) {
      setShown(true);
    } else {
      const timer = setTimeout(() => {
        setShown(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isBusy]);

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "all" : "none",
        visibility: shown ? "visible" : "hidden",
      }}
    >
      <div style={styles.container}>
        <h1 style={styles.text}>
          {isUploading ? "UPLOADING TO GALLERY" : "INITIALIZING EXPERIENCE"}
        </h1>

        <div style={styles.progressBarWrapper}>
          <div
            style={{
              ...styles.progressBar,
              width: isUploading ? "95%" : active ? `${progress}%` : "100%",
              transition: isUploading
                ? "width 10s cubic-bezier(0.1, 0, 0, 1)"
                : "width 0.5s ease-out",
            }}
          />
        </div>

        <div style={styles.percentage}>
          {isUploading ? "PROCESSING..." : active ? `${progress.toFixed(0)}%` : "READY"}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#050505",
    zIndex: 9999,
    transition: "opacity 1s ease-in-out, visibility 1s",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  text: {
    color: "#ffffff",
    letterSpacing: "0.4em",
    fontSize: "10px",
    fontWeight: "bold",
    fontFamily: "monospace",
    animation: "pulse 2s infinite ease-in-out",
  },
  progressBarWrapper: {
    width: "150px",
    height: "1px",
    background: "rgba(255, 255, 255, 0.1)",
  },
  progressBar: {
    height: "100%",
    background: "#ffffff",
  },
  percentage: {
    color: "#ffffff",
    fontSize: "9px",
    fontFamily: "monospace",
    opacity: 0.6,
  },
};