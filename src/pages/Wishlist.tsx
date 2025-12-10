function Wishlist() {
  return (
    <section className="nf-section">
      <div className="nf-section__badge">Wishlist</div>
      <h1 className="nf-section__title">Your curated neon list</h1>
      <p className="nf-section__body">
        Local Storage에 저장된 추천/위시리스트를 표시할 페이지입니다. TMDB API 호출은
        하지 않고 저장된 데이터만 사용합니다.
      </p>
    </section>
  );
}

export default Wishlist;
