export interface LeaderMessage {
  name: string;
  designation: string;
  title: string;
  image: string;
  greeting?: string;
  paragraphs: string[];
  closing: string;
}

const PRESIDENT = { name: "M. A. Quader (Anu)", designation: "President", image: "/images/President.jpg" };
const CHAIRMAN = { name: "Tareq Rahman", designation: "Chairman", image: "/images/Chairman.jpg" };

// Add a new year here; the homepage picks the messages for the selected Olympiad year.
export const MESSAGES_BY_YEAR: Record<number, LeaderMessage[]> = {
  2026: [
    {
      ...PRESIDENT,
      title: "Message from the President",
      paragraphs: [
        "It is with immense pride and heartfelt joy that I welcome all participating clubs, distinguished guests, athletes, and sports enthusiasts to the 6th Gulshan Club Olympiad 2026 - a celebration of sporting excellence, friendship, and unity.",
        "I extend my sincere gratitude to all the participating clubs and athletes whose enthusiasm, dedication, and exemplary sportsmanship made last year’s Olympiad such a memorable success. Your wholehearted participation has strengthened the bonds of friendship and camaraderie that make this gathering truly special.",
        "Since its inception in 2019, the Olympiad has evolved into a cherished tradition, bringing clubs together through the unifying power of sports. Beyond medals and victories, it celebrates teamwork, mutual respect, perseverance, and the enduring friendships that transcend competition.",
        "My heartfelt appreciation goes to our Organizing Committee, convenors, and volunteers for their tireless dedication, and to our valued partners, media partners, and well-wishers whose continued support brings this prestigious sporting celebration to life.",
        "As we gather for another exciting edition, I am confident that Gulshan Club Olympiad 2026 will create new milestones, inspire future generations, and further strengthen the spirit of unity among our clubs. Together, let us uphold the true values of sportsmanship and carry this proud tradition forward.",
        "I wish every athlete the very best and hope this Olympiad brings thrilling contests, remarkable achievements, and memories to cherish for years to come.",
      ],
      closing: "Let us unite through sports, celebrate the spirit of friendship, and pursue excellence together!",
    },
    {
      ...CHAIRMAN,
      title: "Message from the Chairman",
      greeting: "Welcome to the Gulshan Club Olympiad 2026!",
      paragraphs: [
        "The success of last year’s Olympiad has inspired us to make this year’s event even bigger and better. In 2025, we welcomed more than 1,222 participants from 22 clubs across Bangladesh including our expatriate clubs, making it the biggest Olympiad ever hosted by Gulshan Club.",
        "The introduction of the Running Trophy, new sporting events, and a silver medal category brought fresh excitement to the competition. These initiatives made the Olympiad more engaging and competitive while encouraging greater participation across clubs and sporting disciplines.",
        "We are delighted to see our sponsors and partners extending even greater support this year, inspired by the success of the previous Olympiad. My sincere thanks go to all participating clubs, athletes, sponsors, partners, and members of the organising team for their hard work and commitment. I would also like to express my special appreciation to our President, M. A. Quader (Anu), whose direct involvement, guidance, and support have been instrumental in making this event possible.",
        "This year, we are not simply seeking to repeat last year’s success, we are moving forward with greater ambition, stronger support, and a deeper commitment to making the Olympiad 2026 a memorable event that brings together athletes, clubs, and supporters in the spirit of competition and fraternity. With new initiatives, wider participation, and the continued support of our clubs, partners, sponsors, and dedicated team, we look forward to creating an Olympiad that will be remembered with pride.",
        "I look forward to welcoming everyone from 27 November to 5 December 2026 for another memorable Olympiad filled with sportsmanship, friendship, and healthy competition.",
      ],
      closing: "Let us come together to make the Gulshan Club Olympiad 2026 another great success.",
    },
  ],
  2025: [
    {
      ...PRESIDENT,
      title: "Message from the President",
      paragraphs: [
        "On behalf of Gulshan Club Limited, I extend a warm welcome to all participating clubs, athletes, and guests joining us for the 5th Inter-Club Sports Carnival The Gulshan Club Olympiad 2025. Over the years, this Olympiad has become a proud tradition that unites clubs across Bangladesh in the spirit of sports, friendship, and healthy competition.",
        "What began as a vision in 2019 has today grown into one of the most anticipated events in the social club calendar. The Olympiad is a true celebration of talent, teamwork, and shared values. It is not just about winning medals but about building relationships, inspiring future generations, and strengthening the ties between our communities.",
        "The success of this event is the result of extraordinary teamwork. I commend our Organizing Committee, convenors, and volunteers for their dedication, and I offer special thanks to our Chairman of the Organizing Committee, Mr. Tareq Rahman, for his tireless leadership and vision.",
        "We also express our sincere gratitude to our sponsors and partners—Standard Chartered Bank, Prime Bank PLC, Brac Bank PLC, Gulshan Youth Club, and our Media Partners—for their steadfast support, which makes this Olympiad possible year after year.",
        "As President of Gulshan Club, I take immense pride in carrying forward this legacy of unity, sportsmanship, and excellence. May this Olympiad be remembered not only for its competitions but also for the friendships and memories created along the way.",
      ],
      closing: "Welcome to Olympiad 2025. Let us celebrate the joy of sports together.",
    },
    {
      ...CHAIRMAN,
      title: "Message from the Chairman",
      paragraphs: [
        "It gives me immense joy to welcome all participating clubs of Bangladesh to the 5th Inter-Club Sports Carnival “The Gulshan Club Olympiad 2025”. What began in 2019 as a bold initiative to bring social clubs together has now grown into a signature tradition of sporting excellence, friendship, and celebration.",
        "This year, we are honored to host 22 esteemed clubs, 24 teams, and more than 1,200 athletes, competing across 17 sports in 34 categories. Beyond the thrill of competition, this Olympiad is a stage for building friendships, strengthening unity, and deepening the bonds that connect our diverse communities.",
        "The legacy of the Olympiad is carried forward by the tireless efforts of our convenors, volunteers, and organizing committee. Their commitment ensures that every detail, from planning to execution, meets the highest standards.",
        "I also extend my heartfelt gratitude to the President and Board of Directors of Gulshan Club Ltd. for their steadfast guidance, and to all participating clubs for embracing the true spirit of this gathering.",
        "We are deeply grateful to our sponsors and partners whose support has made this journey possible: Diamond Sponsor, Standard Chartered Bank, Platinum Sponsor Prime Bank PLC, Gold Sponsor Brac Bank PLC, Venue Partner - Gulshan Youth Club and our Media Partners, who amplify the reach of this celebration.",
        "As Chairman of the Organizing Committee, it is my privilege to continue this remarkable journey for the fifth consecutive year. Together, let us honor the values of sportsmanship, teamwork, and solidarity, creating memories today that will inspire tomorrow.",
      ],
      closing: "Welcome to Olympiad 2025. Let us play, compete, and celebrate as one family of clubs.",
    },
  ],
};

/** Messages for the year, or the most recent earlier year if that year has none yet. */
export function messagesForYear(year: number) {
  const years = Object.keys(MESSAGES_BY_YEAR).map(Number).sort((a, b) => b - a);
  const match = years.find((y) => y <= year) ?? years[years.length - 1];
  return { year: match, messages: MESSAGES_BY_YEAR[match] ?? [] };
}
