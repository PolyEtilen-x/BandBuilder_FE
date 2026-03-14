export default function PassagePanel({passage}:{passage:string}){

  return (

    <article
      style={{
        padding:"30px",
        overflowY:"auto",
        borderRight:"1px solid #eee"
      }}
    >

      <h1>READING PASSAGE 1</h1>

      <p style={{lineHeight:1.7}}>
        {passage}
      </p>

    </article>

  )

}