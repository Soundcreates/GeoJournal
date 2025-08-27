import React from "react";

function useShare() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My GeoJournal!",
          text: "Check out my latest journal entry!",
          url: window.location.href,
        });
        console.log("Shared successfully!");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return { handleShare };
}

export default useShare;
