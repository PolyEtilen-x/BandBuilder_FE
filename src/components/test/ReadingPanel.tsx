import colors from "@/styles/theme/colors";
import { body } from "framer-motion/client";
import { Bold } from "lucide-react";

export default function ReadingPanel({passage}:any){

  return (

    <article
      style={{
        padding:"30px",
        overflowY:"auto",
        borderRight:"1px solid #eee",
        lineHeight:1.8,
        maxWidth:"100%"
      }}
    >

      <h1 style={{color: "#000", fontSize: "24px", marginBottom: "16px", fontWeight: "bold"}}>
        {passage?.title || "PASSAGE"}
      </h1>

      <h3 style={{lineHeight:1.7, color: colors.text.primary, fontSize: "18px", marginBottom: "24px", fontWeight: 500 }}>
        {passage?.topic || passage?.text  || "No passage"}
      </h3>

      <p
        style={{
          lineHeight: 1.8,
          color: colors.text.primary,
          fontSize: "16px",
          whiteSpace: "pre-line"
        }}
      >
        {passage?.content || "No passage"}
      </p>

    </article>

  )

}