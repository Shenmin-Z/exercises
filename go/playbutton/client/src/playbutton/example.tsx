import React, { FC, CSSProperties } from "react";

let pStyle: CSSProperties = {
  textAlign: "center"
};
let imgStyle: CSSProperties = {
  width: "100%"
};

export let Example: FC = () => {
  return (
    <>
      <div
        style={{
          display: "flex"
        }}
      >
        <div style={{ width: "100%" }}>
          <p style={pStyle}>Before</p>
        </div>
        <div style={{ width: "100%" }}>
          <p style={pStyle}>After</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <div>
          <img style={imgStyle} src="/public/img/input.jpg" alt="input image" />
        </div>
        <div
          style={{
            padding: "0 2px",
            fontFamily: `Arial, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol"`,
            fontSize: 24
          }}
        >
          {"\u27a1"}
        </div>
        <div>
          <img
            style={imgStyle}
            src="/public/img/output.jpg"
            alt="output image"
          />
        </div>
      </div>
    </>
  );
};
