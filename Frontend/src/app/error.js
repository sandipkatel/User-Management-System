// Global error page
"use client";

import React from "react";

export default function GlobalError({ error, reset }) {
  return (
    <div>
        <h2>Something went wrong!</h2>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
