import colors from "@/styles/theme/colors";

export default function PassagePanel({passage}:any){

  return (

    <article
      style={{
        padding:"30px",
        overflowY:"auto",
        borderRight:"1px solid #eee"
      }}
    >

      <h1 style={{color: "#000"}}>
        {passage?.title || "PASSAGE"}
      </h1>

      <h3 style={{lineHeight:1.7, color: colors.text.primary}}>
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