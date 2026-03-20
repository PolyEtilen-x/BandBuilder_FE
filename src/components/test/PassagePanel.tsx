import colors from "@/styles/theme/colors";

export default function PassagePanel({passage}:{passage:string}){

  return (

    <article
      style={{
        padding:"30px",
        overflowY:"auto",
        borderRight:"1px solid #eee"
      }}
    >

      <h1 style={{color: "#000"}}>READING PASSAGE 1</h1>

      <p style={{lineHeight:1.7, color: colors.text.primary}}>
        {passage}
      </p>

    </article>

  )

}