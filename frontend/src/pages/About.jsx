const About = () => {
  return (
    <section className="bg-[#f8f5ef] px-6 py-16 md:px-16 lg:px-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-bold uppercase tracking-widest text-emerald-700">
          Our Story
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          About StyleHub
        </h1>

        <p className="mt-8 leading-8 text-gray-600">
          StyleHub is an online fashion store created to make
          shopping for clothing, footwear and accessories simple
          and convenient. Our goal is to provide a smooth shopping
          experience with a carefully selected product collection.
        </p>

        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400"
          alt="StyleHub fashion store"
          className="mt-12 h-80 w-full rounded-3xl object-cover"
        />
      </div>
    </section>
  );
};

export default About;