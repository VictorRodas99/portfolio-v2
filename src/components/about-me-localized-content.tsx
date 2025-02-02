function SpanishContent() {
  return (
    <>
      <p>
        Me llamo Víctor Rodas, desde una edad temprana me ha apasionado la idea
        de crear cosas desde cero y entender su funcionamiento y he encontrado
        en la programación una forma gratificante de seguir esa pasión y el
        deseo de crear cosas.
      </p>
      <p>
        <span className="text-accent font-bold">
          Entre mis éxitos destaco la creación de una plataforma de turismo
        </span>{' '}
        que permite la observación de diferentes puntos destacados del Ñeembucú;
        <span className="text-accent font-bold">
          llegando a competir en la IX edición de la TECNOCIENCIA
        </span>
        , realizada en mi localidad.
      </p>
      <p>
        Además, cuento con{' '}
        <span className="text-accent font-bold">
          experiencia desarrollando aplicaciones web
        </span>
        ayudando a diferentes negocios para su crecimiento.
      </p>
    </>
  )
}

function EnglishContent() {
  return (
    <>
      <p>
        My name is Víctor Rodas, from an early age I have been passionate about
        the idea of creating things from scratch and understanding how they work
        and I have found in programming a rewarding way to follow that passion
        and the desire to create things.
      </p>
      <p>
        <span className="text-accent font-bold">
          Among my successes I highlight the creation of a tourism platform
        </span>{' '}
        that allows the observation of different highlights of Ñeembucú;{' '}
        <span className="text-accent font-bold">
          reaching the IX edition of TECNOCIENCIA
        </span>
        , held in my locality.
      </p>
      <p>
        In addition, I have{' '}
        <span className="text-accent font-bold">
          experience developing web applications{' '}
        </span>
        helping different businesses for their growth.
      </p>
    </>
  )
}

export default {
  es: SpanishContent,
  en: EnglishContent
}
