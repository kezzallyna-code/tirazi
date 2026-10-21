import React from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import AvailabilityIndicator from '@/components/ui/AvailabilityIndicator';

export default function ArtisansPage() {
  return (
    <div className="stitch-screen-wrapper">

      <main className="pt-24 pb-20 px-margin-desktop max-w-container-max mx-auto relative min-h-screen">

        <div className="fixed inset-0 amazigh-pattern pointer-events-none"></div>
        <div className="grid grid-cols-12 gap-gutter relative">

          <aside className="col-span-12 md:col-span-3">
            <div className="sticky top-28 bg-white/50 p-6 rounded-[24px] border border-outline-variant/30 backdrop-blur-sm shadow-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary mb-6">Refine Network</h2>
              <div className="space-y-8">

                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-3">Specialization</label>
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md">
                    <option>All Categories</option>
                    <option>Master Tailors</option>
                    <option>Embroidery Artists</option>
                    <option>Textile Designers</option>
                    <option>Jewelry Artisans</option>
                    <option>Leather Crafters</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-3">Wilaya (Region)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 px-4 pl-11 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" placeholder="Search Wilaya..." type="text" />
                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline-variant">location_on</span>
                  </div>
                </div>

                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-3">Experience Level</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-body-md group-hover:text-primary transition-colors">Masters (15+ years)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-body-md group-hover:text-primary transition-colors">Experienced (5-15 years)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input defaultChecked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-body-md group-hover:text-primary transition-colors">Emerging Talents</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/20">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-label-md text-label-md text-on-surface">Verified Artisans Only</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" value="" />
                      <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                  </label>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-full font-label-md text-label-md hover:shadow-lg transition-all active:scale-[0.98]">
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          <div className="col-span-12 md:col-span-9 space-y-12">

            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary">New Talents</h3>
                  <p className="text-on-surface-variant">Rising stars in the Algerian fashion ecosystem.</p>
                </div>
                <button className="text-primary font-label-md border-b border-primary hover:pb-1 transition-all">View All</button>
              </div>
              <div className="grid grid-cols-4 gap-6">

                <Link href="/profile" className="col-span-2 row-span-2 group cursor-pointer block">
                  <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img alt="Artisan Profile 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A portrait of a young female Algerian fashion designer working on a mannequin. She is pinning a complex, avant-garde silk garment inspired by traditional Karakou patterns. The studio is minimalist with warm wooden furniture and gold accents. The lighting is soft and cinematic, highlighting the fine texture of the fabric." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmMy--UqOG_IukdsAsOLms-xcEEu0yWOI4s-Kkdvyt_4OzsL25pByPZ_UpEPIwMB36ah8J_JIGj3K0ZYvKIXJCsfw_Hj0h1bJMmaT4NGwbDbKJ2hAuCkXb6MkEvnpISD9U0enlzneNqS34Hk4kqwdz606v7oiRiyK2OqrEB2mIysK0NHaB5WOW5AjgeQN5_wO-WBQ7_kaezYHONVa8opkfIMJK4osuVZALt8EhWgVdVDf2OZA8WfDx2uhAPsoj6wIiDz2zq6vqGSc" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                      <span className="font-label-md text-[12px] text-primary">VERIFIED</span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <AvailabilityIndicator status="available" size="md" showLabel className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm" />
                    </div>
                  </div>
                  <h4 className="font-title-lg text-title-lg text-primary">Lina Benyahia</h4>
                  <p className="text-on-surface-variant font-body-md">Contemporary Karakou Designer • Algiers</p>
                </Link>

                <div className="col-span-2 group cursor-pointer flex gap-6 items-center bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <img alt="Artisan Profile 2" className="w-full h-full object-cover" data-alt="A close-up portrait of a male textile artisan from Constantine, specializing in gold thread embroidery. He is shown with a focused gaze and skilled hands. The background is softly blurred showing high-end velvet fabrics and traditional Algerian motifs. The color palette is rich and warm, evoking professional excellence." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ALaJrWV5HmMqss1jKPAY4m06drxmy6KJKXd7fS4QANx4UKFEZlsX8jgeJeSTy_CT8niXUpEH5mTdUfCp7-vLpqbCHaQ28Gj5jA4QoVSOW4N7EOMy88GJmV8Spm4FHDeKhr7B-BQUGjeShgCrM8b1INRcUl9shbGC8sHTcvgfKJuQ-cg0XMgNrDQe63OuKTdKi20Wiz01JlVp8zt2v7-FsYobfN2il5cKIjLNPgUM31YaEosB0DTmJGyxlJwwqg5SaH6tYnCywLA" />
                    </div>
                    <AvailabilityIndicator status="busy" size="md" className="absolute bottom-1 right-1" />
                  </div>
                  <div>
                    <h4 className="font-title-lg text-title-lg text-primary">Omar Mansour</h4>
                    <p className="text-on-surface-variant font-body-md mb-3">Master Embroiderer</p>
                    <span className="bg-primary-fixed-dim/20 text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-md text-[12px]">Silk Specialist</span>
                  </div>
                </div>

                <div className="col-span-2 group cursor-pointer flex gap-6 items-center bg-white p-6 rounded-[24px] shadow-sm hover:shadow-md transition-all">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <img alt="Artisan Profile 3" className="w-full h-full object-cover" data-alt="A portrait of a professional jewelry artisan in her studio in Tlemcen. She is holding a finely crafted silver filigree necklace. The lighting is crisp and detailed, focusing on the intricate metalwork. The setting is clean and modern with subtle references to Maghrebian architecture in the background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr5IqOMA55j3BSII_aqfwQKJ2xTMJ0Y8SdxJrG3kRGjShjK67bUzEqPDfb5lCK1avDaI72c4BD_PK8PMuIZSRwjbPS1J4lUhgor8D5FvMWfrf3XKDXo613WV3ZQ5YfKmNXztcYwHsz_b-zrPFdHzs8ytA9up46loNZpe7lat_dfMocHCVWzWyEyYecmk2T--rtDc6ncFrSnsANU4RA50NrCRZJNb11Gfs-8-vXRRvTFUhKrc90hCVTEPDS3w5C4NPKAqvWbF2w3sw" />
                    </div>
                    <AvailabilityIndicator status="available" size="md" className="absolute bottom-1 right-1" />
                  </div>
                  <div>
                    <h4 className="font-title-lg text-title-lg text-primary">Sonia Kerroum</h4>
                    <p className="text-on-surface-variant font-body-md mb-3">Jewelry Designer</p>
                    <span className="bg-primary-fixed-dim/20 text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-md text-[12px]">Silver Filigree</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                <h3 className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest px-4">Browse Disciplines</h3>
                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
              </div>
              <div className="grid grid-cols-3 gap-8">

                <div className="group relative aspect-[4/5] rounded-[24px] overflow-hidden cursor-pointer">
                  <img alt="Pattern Making" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A macro shot of a fashion designer's desk with parchment paper, elegant brass shears, and white chalk markings on deep indigo fabric. The lighting is soft and focused, creating a high-end atelier mood. The colors are dominated by cool blues and warm metal tones. Clean, professional minimalist style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfLs1egIfWFKH25fNONWZMfvqi5AmJEZal-exB-aeKcWLUKrwy7RwRaXUduPfWw9_RI3jHBJBHp42xG7MjTkpaQBtpWy3NQ_5ShwaTqsehcNWTJWLvcaJoVZquzTBQxnj2tmM85fdy5kE4tZwaVT9TTdJzRmGYB49z6kjZJrul38_9xOiC9C6ING-BMwnlOhWTN76KAmKWStINiFeoEFl_RUKBKMJtvtWui8dhei0iUcfdyU28QoVXXH7XC1cgKHBlJzOFnrk-CAM" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-label-md text-label-md uppercase tracking-wider opacity-80 mb-1">Couture</p>
                    <h4 className="font-headline-sm text-headline-sm">Pattern Making</h4>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-primary px-6 py-2 rounded-full font-label-md">Explore Artists</span>
                  </div>
                </div>

                <div className="group relative aspect-[4/5] rounded-[24px] overflow-hidden cursor-pointer">
                  <img alt="Weaving Mastery" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="Close up of a traditional Algerian weaving loom with colorful threads in shades of terracotta, deep teal, and cream. A skilled artisan's hand is visible, guiding the shuttle through the warp. The image is bright, capturing the tactile texture of the natural fibers and the cultural heritage of the craft. High-end lifestyle photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBID3nRGC-FcUwea26YGCxqnmtUzTMafVUcJpM-U83YwSziB6_2JWcYsYpxfI_uve__lOqO3zbgWvYVWMxwtx8RIVM7uPvQ1D48G527SNgS_v_bQp6Nw7e_aefOX5_E2C_yxkfm1Q_OH0k4cKQSR9MWK4OgUQqDecz9yebiOjI622yfvWad_ADv9i5AVBf2XRgPuSroWdHXQxkz9H2WvWbPAegVk1TNNc37-3rS1hz0gfM14bsSnFjCp194amNTuptmqGG5SU9RLM" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-label-md text-label-md uppercase tracking-wider opacity-80 mb-1">Heritage</p>
                    <h4 className="font-headline-sm text-headline-sm">Textile Weaving</h4>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-primary px-6 py-2 rounded-full font-label-md">Explore Artists</span>
                  </div>
                </div>

                <div className="group relative aspect-[4/5] rounded-[24px] overflow-hidden cursor-pointer">
                  <img alt="Digital Design" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="A modern designer working on a high-resolution tablet, creating digital embroidery patterns. The screen glows with intricate geometric motifs in vibrant gold and teal. The workspace is sleek and organized, representing the fusion of traditional craft and modern technology in the Algerian fashion industry. Light, airy, and sophisticated atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuANPtXdGq9ax2PoN60dvYatyDaRmi21J2mnbDLycQ_tf_8FL53Dpu3XikZyHnLzuLvTYTA7Q2Iy281ZOLdEF4YJ0McTdVwAlFZDN9vZL67NKfzzQNrGdLcztvUbj5BAOneKmV70wVwn-_9kaJPN2CZasU8m9poHbC4VvF_tsdgtg8qPqVvNUvY66oYGwwRSgFz1X43BQMRCu3_UuXHCV8c_rW2b-Wc5YVbgT1_HcZtV021jwUhNtHsDjI4p61y2KQrdXs5OzU8G_CA" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-label-md text-label-md uppercase tracking-wider opacity-80 mb-1">Innovation</p>
                    <h4 className="font-headline-sm text-headline-sm">Digital Fashion</h4>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-primary px-6 py-2 rounded-full font-label-md">Explore Artists</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[32px] p-8 border border-outline-variant/30">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-headline-sm text-headline-sm text-primary">Featured Artisans</h3>
                <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-full">
                  <button className="px-4 py-1.5 rounded-full bg-white shadow-sm font-label-md text-[12px] text-primary">ALL</button>
                  <button className="px-4 py-1.5 rounded-full font-label-md text-[12px] text-on-surface-variant hover:text-primary transition-colors">AVAILABLE NOW</button>
                </div>
              </div>
              <div className="space-y-4">

                <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-all border-b border-transparent hover:border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                        <img alt="Artisan 1" data-alt="A professional headshot of a female artisan with a friendly, creative smile. She is wearing a modern interpretations of traditional attire and jewelry. The background is a high-end craft exhibition with soft, diffused lighting and warm neutral colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_Bv31YIr6q71GIj5Pq3H7tTuKrrbhrfuQNMPI2Uurt6B0-eEWPsfSQP9woNuY_i6OmqPpOkPHJ_Tbt6BTZIzDEYS0qUbPD5GJmvT7AsSMRtLL8Pmch2pNhXHIDwgAjihfLJDIs2JzLgeGoF6qPpaJtDIyaSAhJAMFV0IsV-eKa6I6vuaQrR-egYxiAyGt7WbuFN7Orw7ziS8_A-wYkW1dj8VFoKeN3vsNCR3SqCP0xsL1bEd6vnjeBU9p_CvDyYJHaN6dineFtCU" />
                      </div>
                      <AvailabilityIndicator status="available" size="sm" className="absolute -bottom-1 -right-1" />
                    </div>
                    <div>
                      <h5 className="font-title-lg text-body-lg text-primary">Meriem Sadi</h5>
                      <p className="text-on-surface-variant text-[14px]">Leather Craft • Constantine</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-12">
                    <div className="text-right">
                      <p className="font-label-md text-[12px] text-on-surface-variant uppercase">Projects</p>
                      <p className="font-bold text-primary">24</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label-md text-[12px] text-on-surface-variant uppercase">Rating</p>
                      <div className="flex items-center text-secondary">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        <span className="font-bold">4.9</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/profile" className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all font-label-md text-[13px]">
                    Profile
                    <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                  </Link>
                </div>

                <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-all border-b border-transparent hover:border-primary/10">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                        <img alt="Artisan 2" data-alt="A focused headshot of a seasoned male master weaver from Ghardaia. He has a distinguished presence and wears a traditional Saharan garment. The lighting is warm and natural, emphasizing the professional dignity and deep cultural knowledge of his craft." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzox6LrkyudjCFHXOB_-doIdlmet2DCJXSdWZHzk9fzZfL4qYDN6K3K1W4l0tTBUwUmSsjCEA7rFV0AUglBkK16ncqoLNwgmP76up0ssMamoS49Dil8kg8_nRkOPxH3mXClWPtOWOc8cmMvTAlfAfsXJoc9yWi4xf4RmOvG74fiPUswl7BmWO_EMxhQ3qkoZriyYpxOnakI0BRuxuqbGKVMFmtvfYJXhgcC8yAxMDN435VDtAU_uBbJ93RzoGUm5q9bsCBrvwzj7Q" />
                      </div>
                      <AvailabilityIndicator status="busy" size="sm" className="absolute -bottom-1 -right-1" />
                    </div>
                    <div>
                      <h5 className="font-title-lg text-body-lg text-primary">Ahmed Belkacem</h5>
                      <p className="text-on-surface-variant text-[14px]">Traditional Weaving • Ghardaïa</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center gap-12">
                    <div className="text-right">
                      <p className="font-label-md text-[12px] text-on-surface-variant uppercase">Projects</p>
                      <p className="font-bold text-primary">87</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label-md text-[12px] text-on-surface-variant uppercase">Rating</p>
                      <div className="flex items-center text-secondary">
                        <span className="material-symbols-outlined text-[16px]">star</span>
                        <span className="font-bold">5.0</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/profile" className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all font-label-md text-[13px]">
                    Profile
                    <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                  </Link>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/20 text-center">
                <button className="bg-surface-container-highest text-primary px-10 py-3 rounded-full font-label-md hover:bg-outline-variant/30 transition-all">
                  Load More Professionals
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <button className="fixed bottom-10 right-10 bg-primary text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all group">
        <span className="material-symbols-outlined">help_center</span>
        <span className="absolute right-full mr-4 bg-white text-primary px-4 py-2 rounded-lg text-label-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Need Assistance?</span>
      </button>
    </div>
  );
}
