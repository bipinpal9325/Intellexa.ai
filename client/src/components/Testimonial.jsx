const Testimonial = () => {
    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Amit Sharma',
            handle: '@amitwrites',
            location: 'Delhi, India',
            comment: 'Radiant made undercutting all of our competitors an absolute breeze.',
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Dhruv Tiwari',
            handle: '@dhruvtiwari',
            location: 'Mumbai, India',
            comment: 'The seamless experience with Radiant transformed our workflow efficiency.',
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Rajesh Kumar',
            handle: '@rajeshdev',
            location: 'Bangalore, India',
            comment: 'A game-changer in the industry, Radiant exceeded all expectations.',
        },
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Bipin Pal',
            handle: '@bipinpal9325',
            location: 'Mumbai, India',
            comment: 'Exceptional service and support, Radiant is a must-have tool.',
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-5 rounded-xl mx-3 border border-white/10 bg-white/[0.04] backdrop-blur
            hover:bg-white/[0.07] transition-colors duration-300 w-72 shrink-0">
            <div className="flex gap-3">
                <img className="size-11 rounded-full object-cover" src={card.image} alt="User" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p className="text-white text-sm font-medium">{card.name}</p>
                        <svg className="mt-0.5 fill-primary" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" />
                        </svg>
                    </div>
                    <span className="text-xs text-white/40">{card.handle}</span>
                    <span className="text-xs text-white/40">{card.location}</span>
                </div>
            </div>
            <p className="text-sm py-3 text-white/70 font-display italic leading-relaxed">
                &ldquo;{card.comment}&rdquo;
            </p>
        </div>
    );

    return (
        <section className="bg-ink py-24">
            <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }
            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }
            .marquee-reverse {
                animation-direction: reverse;
            }
            @media (prefers-reduced-motion: reduce) {
                .marquee-inner { animation: none !important; }
            }
        `}</style>

            <div className="max-w-xl mx-auto text-center mb-14 px-6">
                <p className="font-mono-label text-xs uppercase text-accent mb-4">Early feedback</p>
                <h2 className="font-display text-3xl sm:text-4xl text-white font-medium">
                    Trusted by early adopters
                </h2>
            </div>

            {['normal', 'reverse'].map((dir, i) => (
                <div key={i} className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative z-0">
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-ink to-transparent"></div>
                    <div className={`marquee-inner ${dir === 'reverse' ? 'marquee-reverse' : ''} flex transform-gpu min-w-[200%] pt-5 pb-5`}>
                        {[...cardsData, ...cardsData].map((card, index) => (
                            <CreateCard key={index + i * cardsData.length} card={card} />
                        ))}
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-ink to-transparent"></div>
                </div>
            ))}
        </section>
    )
}

export default Testimonial;