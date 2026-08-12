/*
  O link do WhatsApp estava escrito inline em três componentes (Hero,
  Navbar e CTA Final). Quando o cliente trocou o número em 2026-08-06,
  as três cópias precisaram ser caçadas uma a uma — e uma cópia esquecida
  manda o visitante para um telefone que não atende mais, sem erro nenhum
  que denuncie isso.

  A mensagem já vem preenchida para quem recebe saber de onde veio o
  contato.
*/
export const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=5541998210022" +
  "&text=Ol%C3%A1%2C+tudo+bem%3F%0AVim+do+site+e+quero+saber+mais+sobre+os+servi%C3%A7os+da+Celer+Capital%21" +
  "&type=phone_number&app_absent=0";
