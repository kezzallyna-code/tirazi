import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="stitch-screen-wrapper">
      

<main className="relative pt-24 min-h-screen">

<div className="absolute inset-0 textile-grid pointer-events-none"></div>
<div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none amazigh-pattern">

<svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
<path d="M0 0 L50 50 L100 0 M0 50 L50 100 L100 50" fill="none" stroke="#076760" strokeWidth="0.5"></path>
</svg>
</div>

<section className="max-w-container-max mx-auto px-margin-desktop py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">

<div className="lg:col-span-6 z-10">
<div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-md mb-6">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Elevating Algerian Craft
                </div>
<h1 className="font-display text-display-lg-mobile md:text-display-lg lg:text-[54px] lg:leading-[1.15] text-primary mb-4 font-bold">
  Connect, verify, and collaborate across 69 wilayas
</h1>
<p className="font-headline-md text-headline-md text-secondary-container font-arabic mb-8 italic" dir="rtl">
                    مصمم... وأكثر
                </p>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed">
                    A dedicated ecosystem for Algeria’s textile masters, high-end fashion designers, and traditional artisans. We weave heritage with modern professionalism to showcase excellence to the world.
                </p>
<div className="flex flex-wrap gap-4">
<Link href="/register" className="px-8 py-4 bg-primary text-on-primary font-label-md text-label-md rounded-full shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 inline-block">
    Join the Atelier
</Link>
<Link href="/showcase" className="px-8 py-4 border-2 border-secondary text-secondary font-label-md text-label-md rounded-full hover:bg-secondary/5 transition-all active:scale-95 inline-block text-center">
                        Explore Showcase
                    </Link>
</div>
</div>

<div className="lg:col-span-6 grid grid-cols-6 gap-4 h-[600px]">
<div className="col-span-4 row-span-4 rounded-[24px] overflow-hidden shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
<img className="w-full h-full object-cover" data-alt="A high-end editorial fashion shot of an Algerian model wearing a contemporary Karakou with intricate golden thread embroidery. The lighting is dramatic, high-contrast chiaroscuro, emphasizing the rich texture of the velvet fabric and the artisan's meticulous needlework. The background is a soft, warm beige, maintaining a luxury Mediterranean aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl6KOnPdva_SBHveLMu4pvLdzKTTBu6n_qFAfw8isxOf_0SYiGdjKhqK9_kEj7VxDE-WpSkQ3o1BmszoJMF_S_2HmrdyAdQQS4Fj7OZnZ_O7z2XNKRgND3zmScyR9QYAptmRDBTSdCkuq5BKGl8UHWsfc_3uhxCO7v1F5KxfT8qFGUwYTqds__lsMDPEPj7AMP0n1dSZTzLddp9oVz5JKYv3LvrJHRFfqO4tgTXuRYqCNAdoG8Rrlbv4qsDhNuuS8TQeOQgbG7zes"/>
</div>
<div className="col-span-2 row-span-3 rounded-[24px] overflow-hidden shadow-lg mt-12">
<img className="w-full h-full object-cover" data-alt="A close-up macro photograph of raw silk fibers and hand-dyed turquoise threads being woven on a traditional wooden loom. The shot captures the tactile nature of the textile craft, with dust motes dancing in a single beam of golden Mediterranean sunlight. The overall atmosphere is artisanal, serene, and deeply rooted in heritage craft traditions." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx9qB3WUz3kSCSqB6HqejxyDsBzcYE8MdNI17bxMo9RM2bAtfeSL4sTAsGnRufL8F5BCMfQhghrR8kgS7dsvhyte_CLp8_jDLPHdqzOURHe_HT6sqgGlTsZeI5YmzS2AB2wClXSqcrGalqKSzfOqRUwwuI9qF5d3jrW3UFK_0h2t7-zVCTUW9-81LdhdqAhqGRzkgf18yhSY0QbpPbfucViXTdbeepMe234qk__a7-h37-mX_2nrFDxV9mSpZDMIMBVz4uHp2OsPw"/>
</div>
<div className="col-span-3 row-span-2 rounded-[24px] overflow-hidden shadow-lg -mt-8 glass-card p-4">
<div className="flex flex-col h-full justify-center text-center">
<span className="font-display-lg text-headline-md text-primary">1200+</span>
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Active Artisans</span>
</div>
</div>
<div className="col-span-3 row-span-2 rounded-[24px] overflow-hidden shadow-lg -mt-8">
<img className="w-full h-full object-cover" data-alt="An elegant, minimalist fashion showroom in Algiers with white walls and natural stone flooring. Garments are displayed on custom wooden rails, and a large window looks out onto a sun-drenched courtyard with Mediterranean plants. The space feels premium, airy, and sophisticated, reflecting the contemporary minimalist design language of the TIRAZY brand." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZvTnAmFOLi_8qer8kMK8fHpyWH9t7EiJAr0KshEJ05aapNLfDRcraKTS-7OAtTpXIFoBI7d7lCAJACbRw74H78DTTk-vDoRCTWvCop4wWQ0J79-9theTvxQYjWrPss8kN6bdmsN1k_jlmwvpmBwj4TLp4ecBvKZVfbUUriKDPoHFg5F1kfRuCuxZzeeScej_65Ok_E92Uw1Xt4I64wtKe3WRK9SulpOQfbLvVq0T-EwalgEaE5ySBn9LHnT57QYfl9qrYmjU3WzQ"/>
</div>
</div>
</section>

<section className="bg-surface-container-low py-24 relative overflow-hidden">
<div className="max-w-container-max mx-auto px-margin-desktop">
<div className="text-center mb-16">
<h2 className="font-headline-md text-headline-md text-primary mb-4">Crafted for Excellence</h2>
<div className="w-24 h-1 bg-secondary-container mx-auto rounded-full"></div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-4xl mx-auto">

<div className="p-8 bg-surface rounded-[24px] shadow-sm hover:shadow-md transition-shadow group">
<div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-[32px]">architecture</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-3">Structured Portfolios</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Showcase your technical drawings, fabric swatches, and final garments in high-fidelity editorial layouts.</p>
</div>

<div className="p-8 bg-surface rounded-[24px] shadow-sm hover:shadow-md transition-shadow group">
<div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-all">
<span className="material-symbols-outlined text-[32px]">hub</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-3">Professional Network</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Connect with textile suppliers, pattern makers, and creative directors within a closed professional ecosystem.</p>
</div>
</div>
</div>
</section>

<section className="max-w-container-max mx-auto px-margin-desktop py-24">
<div className="flex flex-col lg:flex-row items-center gap-16">
<div className="w-full lg:w-1/2 relative">
<div className="absolute -inset-4 border-2 border-primary/20 rounded-[32px] -z-10 translate-x-4 translate-y-4"></div>
<div className="rounded-[24px] overflow-hidden aspect-[4/5] shadow-2xl">
<img className="w-full h-full object-cover" data-alt="A portrait of a master Algerian textile artisan in her workshop, surrounded by rolls of luxurious fabrics and intricate embroidery patterns. She is focused on her work, holding a traditional needle. The lighting is warm and directional, creating a respectful and dignified portrayal of the artisan. The background shows hints of a heritage-rich studio space." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkcd51CDz3pOUEO7RUOPKHhHDfWxNRt_6BFL4npTGrekiR2UEoT7FX_MGB1QcLuBlC3rgNMqAW9z4T-MUVHKeUVEenlxyhj6pw2lMo8h4riIc7e44ACMahN5gGqcukTzwUoQzVS-8kyBiVsFycahJeD-3N_UAJBj8OJ4Z2BZrSARCPliwWYnlwtSqiLEdvYtQFQSA3PcOb64AJ23OF51BRqbSh1sfwOKZaR1Bkp4gPTCd9OX8I_IWtbYHfqohtou2vIA8T8mQBWaI"/>
</div>
</div>
<div className="w-full lg:w-1/2">
<h4 className="font-label-md text-label-md text-secondary uppercase tracking-[0.2em] mb-4">Spotlight</h4>
<h2 className="font-headline-md text-headline-md text-primary mb-6">Maison de Couture Algiers</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8 italic">
                        "TIRAZY has transformed how we present our ancestral techniques to a modern audience. It's not just a platform; it's our digital atelier."
                    </p>
<div className="flex items-center gap-4 mb-10">
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary" data-weight="fill">verified</span>
</div>
<div>
<p className="font-title-lg text-title-lg text-on-surface">Zahra Benali</p>
<p className="font-label-md text-label-md text-on-surface-variant">Creative Director</p>
</div>
</div>
<Link href="/profile/artisan-zahra" className="px-8 py-4 bg-transparent border border-outline text-on-surface font-label-md text-label-md rounded-full hover:bg-surface-container-high transition-all inline-block">
                        View Portfolio
                    </Link>
</div>
</div>
</section>

<footer className="bg-primary text-on-primary py-20">
<div className="max-w-container-max mx-auto px-margin-desktop text-center">
<Link href="/"><Logo className="h-12 w-auto object-contain" /></Link>
<h2 className="font-headline-md text-headline-md mb-8 max-w-2xl mx-auto">Ready to weave your legacy into the future of Algerian fashion?</h2>
<div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
<div className="bg-on-primary-container/10 p-6 rounded-[24px] flex flex-col items-center w-full md:w-48">
<span className="material-symbols-outlined text-[40px] mb-4">palette</span>
<p className="font-title-lg text-title-lg">For Designers</p>
</div>
<div className="bg-on-primary-container/10 p-6 rounded-[24px] flex flex-col items-center w-full md:w-48">
<span className="material-symbols-outlined text-[40px] mb-4">precision_manufacturing</span>
<p className="font-title-lg text-title-lg">For Artisans</p>
</div>
</div>
<div className="pt-12 border-t border-on-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
<p className="font-label-md text-label-md opacity-60">© 2024 TIRAZY. All rights reserved.</p>
<div className="flex gap-8 font-label-md text-label-md opacity-80">
<Link className="hover:text-secondary-fixed transition-colors" href="/contact#privacy">Privacy</Link>
<Link className="hover:text-secondary-fixed transition-colors" href="/contact#terms">Terms</Link>
<Link className="hover:text-secondary-fixed transition-colors" href="/contact">Contact</Link>
</div>
</div>
</div>
</footer>
</main>
    </div>
  );
}
