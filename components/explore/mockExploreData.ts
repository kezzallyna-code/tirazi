export interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  date: string;
}

export interface Post {
  id: string;
  artisan: {
    id: string;
    name: string;
    avatar: string;
    specialization: string;
    wilaya: string;
    verified: boolean;
    availability?: 'available' | 'busy' | 'unavailable';
  };
  date: string;
  postType: string;
  category: string;
  wilaya: string;
  text: string;
  image?: string;
  video?: string;
  appreciations: number;
  comments: Comment[];
}

export interface SuggestedArtisan {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  wilaya: string;
  verified: boolean;
  isFollowing: boolean;
  availability?: 'available' | 'busy' | 'unavailable';
}

export const initialMockPosts: Post[] = [
  {
    id: "post-1",
    artisan: {
      id: "artisan-leila",
      name: "Leila Belkacem",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2_x3_d3fVvyfHmnTf9fgvjmwC81AdX3f4JADyna4UXNNDoa9V1sUEQHWINsexZUMDixO7iZAbFXpFardkBjutDk8WcuQeqPDdqD3Uezidv6ERUlKShh1oKH15AAha-fLMeYY3NgXAxrnq5X-yl99hkJ6GJixSKAT1CAoHK5xMpKZGaMuz1KzmY8-6WskzJIyvFPNcL3XBlPCA567Jv1HALykY7BJDjZV0e4Xoa_YjUFRexhnb88GErM9c2T4CaVfquy1zZb9TsTc",
      specialization: "Modern Kabyle Designer",
      wilaya: "Tizi Ouzou",
      verified: true,
    },
    date: "2 hours ago",
    postType: "Work Showcase",
    category: "Traditional Clothing",
    wilaya: "Tizi Ouzou",
    text: "Just finalized the sample templates for our upcoming Mediterranean collection. We are weaving traditional Amazigh symbols into contemporary wool capes. The tactile weight of the hand-woven wool from Ghardaia is absolutely unmatched. Let me know what you think of the geometric pattern layouts!",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqmR38wKUArH1jCI6hvkULy8Krkd9kcXLt7w89-lyhohqe3Yj5cgDpVY_xsxcJSnsKMwGbrsNZNQ7ORsMRlAj-jfdIswL3diyPgJLOv8AXUHHGkY1I-9Ee6qEnxUOZaIUZ_RBgjSDtbVkRZyhX2gPsHvbyUjfoHYbGtrLrbPIASoE1qI2eWqthbNViYeVluUhBMCWVVCAhlmlb2oM4gsHpTsw7-IrZtgsICGoqq50kHm1cj8fBn0t-i3VaOut4BdR_9P1n_pQPmVs",
    appreciations: 24,
    comments: [
      {
        id: "c-1",
        name: "Master Amine",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQqWvx-XEkF3kIz7IfbDKJ_zEzBMaKlbtbEdJ6f7ImIhCW4ZOeQkTCg774sPTDbDoulWLTvmO6SuxSpiuPOntp780WT55dLAg_zD_8Cj-tvuC3WgdSr64Xl8ZyLC8XtAXmYI5vDCaKyKjsm7NdAs7sgJqI0e8fwNafFeYL7z7uqL37TrjpgzXet1TNV-gw97I8oKtXJsR6XDt_xGuYahSApIL28AXr5j_Vefzc8bbO4MR8WdB-2g5sfqPf_XtG1kETQHm_t_kjVrA",
        text: "The symmetry in the border patterns is perfectly proportioned, Leila. It is beautiful to see the heritage preserved so elegantly.",
        date: "1 hour ago",
      },
      {
        id: "c-2",
        name: "Sarah Mansouri",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDjNQGwW1FtqIG_ah_xaGi5iM0ey8YiUptImzA8i5UWqO6E7ZXIkY50nQYHooP2zEWVNH4VITf8nQ3CYvxG1VRbS0AgIi9SHRUCJBazI4xSuwC68rKyjb_wTuBfxUepqPdczQIEx15cgZV4q3W6F5Si6rInzlRTWD094ovfzwFCUoz9Pd2NVMAlrudU33MrBrutRbcPJUTfq_uF9fTjXvhrrsf4qEFQ9Ux4NgdoWBVdZUQfmqKaZx7Xa61XB8stXzYNkyoza5kBdVI",
        text: "Can't wait to see the final editorial shoot. This contrast of indigo threads is striking!",
        date: "30 mins ago",
      }
    ],
  },
  {
    id: "post-2",
    artisan: {
      id: "artisan-amine",
      name: "Master Amine",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQqWvx-XEkF3kIz7IfbDKJ_zEzBMaKlbtbEdJ6f7ImIhCW4ZOeQkTCg774sPTDbDoulWLTvmO6SuxSpiuPOntp780WT55dLAg_zD_8Cj-tvuC3WgdSr64Xl8ZyLC8XtAXmYI5vDCaKyKjsm7NdAs7sgJqI0e8fwNafFeYL7z7uqL37TrjpgzXet1TNV-gw97I8oKtXJsR6XDt_xGuYahSApIL28AXr5j_Vefzc8bbO4MR8WdB-2g5sfqPf_XtG1kETQHm_t_kjVrA",
      specialization: "Master Couturier & Tailor",
      wilaya: "Constantine",
      verified: true,
    },
    date: "Yesterday",
    postType: "Thought",
    category: "Couture",
    wilaya: "Constantine",
    text: "Spent the morning adjusting the draping on a traditional Karakou jacket. Incorporating authentic Fetla gold thread embroidery requires absolute precision and hours of patience. Every stitch represents centuries of Algerian heritage.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnYNso6SqGYN9mbFQ3LMgtCorWbBUGboPNULEnpCBLVkFDFkO7BmmDWW58BVD6zW4YLDNWqsoDvDZR80mSFuvEleH2qC607ABF_pNEwpSwOa8W7Is_jOB6t3jkPaUabR-UuUsykXxC0cUWq62GVxwwUGpC6AdPHateWXuldMINlurJXr33u_Odj658W0C0Fh8OnU9wFMA-Qs_OOvvKbN7oXeWeU7cX8evBXVViYA8fTOQv-ph1rFo8Y2ZXA-hhX_spA8mklB2U2pg",
    appreciations: 42,
    comments: [
      {
        id: "c-3",
        name: "Leila Belkacem",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2_x3_d3fVvyfHmnTf9fgvjmwC81AdX3f4JADyna4UXNNDoa9V1sUEQHWINsexZUMDixO7iZAbFXpFardkBjutDk8WcuQeqPDdqD3Uezidv6ERUlKShh1oKH15AAha-fLMeYY3NgXAxrnq5X-yl99hkJ6GJixSKAT1CAoHK5xMpKZGaMuz1KzmY8-6WskzJIyvFPNcL3XBlPCA567Jv1HALykY7BJDjZV0e4Xoa_YjUFRexhnb88GErM9c2T4CaVfquy1zZb9TsTc",
        text: "The gold luster on the dark velvet is breath-taking, Master Amine. Your attention to detail is an inspiration.",
        date: "Yesterday",
      }
    ],
  },
  {
    id: "post-3",
    artisan: {
      id: "artisan-zahra",
      name: "Zahra Benali",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkcd51CDz3pOUEO7RUOPKHhHDfWxNRt_6BFL4npTGrekiR2UEoT7FX_MGB1QcLuBlC3rgNMqAW9z4T-MUVHKeUVEenlxyhj6pw2lMo8h4riIc7e44ACMahN5gGqcukTzwUoQzVS-8kyBiVsFycahJeD-3N_UAJBj8OJ4Z2BZrSARCPliwWYnlwtSqiLEdvYtQFQSA3PcOb64AJ23OF51BRqbSh1sfwOKZaR1Bkp4gPTCd9OX8I_IWtbYHfqohtou2vIA8T8mQBWaI",
      specialization: "Creative Director, Maison de Couture",
      wilaya: "Algiers",
      verified: true,
    },
    date: "3 days ago",
    postType: "Work Showcase",
    category: "Traditional Clothing",
    wilaya: "Algiers",
    text: "Our showroom in Algiers is finally redesigned to highlight the work of local weavers. Stop by this week to explore the collection of hand-dyed organic linens and see the live weaving demonstration. Let's build stronger bridges between ancestral craft and modern fashion.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl6KOnPdva_SBHveLMu4pvLdzKTTBu6n_qFAfw8isxOf_0SYiGdjKhqK9_kEj7VxDE-WpSkQ3o1BmszoJMF_S_2HmrdyAdQQS4Fj7OZnZ_O7z2XNKRgND3zmScyR9QYAptmRDBTSdCkuq5BKGl8UHWsfc_3uhxCO7v1F5KxfT8qFGUwYTqds__lsMDPEPj7AMP0n1dSZTzLddp9oVz5JKYv3LvrJHRFfqO4tgTXuRYqCNAdoG8Rrlbv4qsDhNuuS8TQeOQgbG7zes",
    appreciations: 56,
    comments: [],
  },
  {
    id: "post-4",
    artisan: {
      id: "artisan-yasmine",
      name: "Yasmine Oualid",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAItdWOY1pa8uzAkEWfvWhanlTiXv9DAoduMTmWyO3IE6RDN82XvD58K4_6SF-C86dsaKsAaGQ2dClIuJ7vsSpIdt_g5-vXTTazjbv1k5ROJmzUobVENKACilTR0qMVo_fbj6g_2lfu5jsinhuT-uOtT4_-1_elVDRy9qgoCSDwRerl13FtayNlmGBQeA401jB0e5NI--XWlgcF65mKn3ayMC8HVXAsHIzP_M1Yz2YzYhcwcPpzOFGKEweeMMaeEa4I3vacwU_RRMc",
      specialization: "Embroidery Artist",
      wilaya: "Tlemcen",
      verified: true,
    },
    date: "4 days ago",
    postType: "Tip",
    category: "Embroidery",
    wilaya: "Tlemcen",
    text: "Tip for fellow embroiderers: When working with silk threads on velvet, always ensure your tension is slightly looser than usual. This prevents the velvet pile from crushing and allows the silk to catch the light beautifully. What are your favorite techniques for working with velvet?",
    appreciations: 89,
    comments: [
      {
        id: "c-4",
        name: "Fatima Bouhired",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ukrSHB2QPEMVsPyWTlDMi5t4w6Jv80AmFbsVd-zmwbB0dqJveqo3SyjZew1qJ261SCXvxtPo_RkGwyg7g9gc-IdxnH3CLg9Cq0IKjUrM1XLd6DWTALk6VhuoIFmgIVpDEUXzJ6oQ7tV35-tbB1eyHlAjRueE2q6u-PrQRaFqTZIcv6ibg_qjrt85uxJRLuEq1KLV4i8xd2-XxQrgUpXESLN5iwxwcqwlP6TO2wKlzNwqovPiu7_EorQPKcF2pwhPFAfTpORTI4g",
        text: "Great tip! I usually add a thin layer of soluble stabilizer on top. It works wonders.",
        date: "3 days ago",
      }
    ],
  },
  {
    id: "post-5",
    artisan: {
      id: "artisan-rachid",
      name: "Rachid Meziane",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Vq2VhoFu44ICvw4kX78ly5ngopQcd_jvPL-otjDl181yWrKmnKypoBLLGF_g44Y8YBOh0mYjQ0zz4fwOwlK0CUHqqhB-DIjyGYJAoL6LMv2ZRNzoPa3XblLnj7m4miCSjVy-hCCt7iV1LwUuXfbheo4qzqpYirr03951PR09kO0u83QfMV99AmHdkFiVtDn8IqhzWEXvu5ozxK1fE3-jQ4MgyJ8aMt4DQ_s1iLegIKF0ZeZjmLw5L3Sz0rWM6PYP1JKGnZWsPgY",
      specialization: "Leather Craft Master",
      wilaya: "Oran",
      verified: true,
    },
    date: "1 week ago",
    postType: "Question",
    category: "Leather Work",
    wilaya: "Oran",
    text: "Does anyone have a reliable supplier for organic vegetable-tanned leather in the western region? The quality of my recent batch from my usual source has dropped significantly, and I need consistent thickness for my upcoming collection of traditional belts and bags.",
    appreciations: 12,
    comments: [],
  }
];

export const initialMockArtisans: SuggestedArtisan[] = [
  {
    id: "artisan-yasmine",
    name: "Yasmine Oualid",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAItdWOY1pa8uzAkEWfvWhanlTiXv9DAoduMTmWyO3IE6RDN82XvD58K4_6SF-C86dsaKsAaGQ2dClIuJ7vsSpIdt_g5-vXTTazjbv1k5ROJmzUobVENKACilTR0qMVo_fbj6g_2lfu5jsinhuT-uOtT4_-1_elVDRy9qgoCSDwRerl13FtayNlmGBQeA401jB0e5NI--XWlgcF65mKn3ayMC8HVXAsHIzP_M1Yz2YzYhcwcPpzOFGKEweeMMaeEa4I3vacwU_RRMc",
    specialization: "Embroidery Artist",
    wilaya: "Tlemcen",
    verified: true,
    isFollowing: false,
    availability: "available",
  },
  {
    id: "artisan-rachid",
    name: "Rachid Meziane",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Vq2VhoFu44ICvw4kX78ly5ngopQcd_jvPL-otjDl181yWrKmnKypoBLLGF_g44Y8YBOh0mYjQ0zz4fwOwlK0CUHqqhB-DIjyGYJAoL6LMv2ZRNzoPa3XblLnj7m4miCSjVy-hCCt7iV1LwUuXfbheo4qzqpYirr03951PR09kO0u83QfMV99AmHdkFiVtDn8IqhzWEXvu5ozxK1fE3-jQ4MgyJ8aMt4DQ_s1iLegIKF0ZeZjmLw5L3Sz0rWM6PYP1JKGnZWsPgY",
    specialization: "Leather Craft Master",
    wilaya: "Oran",
    verified: true,
    isFollowing: false,
    availability: "busy",
  },
  {
    id: "artisan-fatima",
    name: "Fatima Bouhired",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ukrSHB2QPEMVsPyWTlDMi5t4w6Jv80AmFbsVd-zmwbB0dqJveqo3SyjZew1qJ261SCXvxtPo_RkGwyg7g9gc-IdxnH3CLg9Cq0IKjUrM1XLd6DWTALk6VhuoIFmgIVpDEUXzJ6oQ7tV35-tbB1eyHlAjRueE2q6u-PrQRaFqTZIcv6ibg_qjrt85uxJRLuEq1KLV4i8xd2-XxQrgUpXESLN5iwxwcqwlP6TO2wKlzNwqovPiu7_EorQPKcF2pwhPFAfTpORTI4g",
    specialization: "Silk Weaver",
    wilaya: "Ghardaia",
    verified: false,
    isFollowing: false,
    availability: "available",
  }
];
