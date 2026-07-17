import { Product, Testimonial, FaqItem } from "@/types";

export const products: Product[] = [
  {
    id: "scoop-1",
    name: "Primeira Surpresa",
    price: 119.9,
    image: "/images/scoop-1.jpg",
    category: "Scoop",
    rating: 4.9,
    reviews: 342,
    description: "Viva a experiência Lisory e descubra acessórios escolhidos especialmente para surpreender você!\n\nVocê recebe:\n• 4 acessórios garantidos\n• Chance de ganhar acessórios extras durante a abertura\n• Mix dourado e prata\n• Vídeo exclusivo da abertura\n• Até 2 trocas caso não goste de alguma peça\n\nCada scoop é montado de forma surpresa, tornando a experiência única.",
    scoop: { items: 4, extra: true, exchanges: 2 },
  },
  {
    id: "scoop-2",
    name: "Brilho em Dobro",
    price: 229.90,
    image: "/images/scoop-2.jpg",
    badge: "Mais Popular",
    category: "Scoop",
    rating: 4.9,
    reviews: 261,
    description: "Eleve sua experiência Lisory com ainda mais possibilidades.\n\nVocê recebe:\n• 6 acessórios garantidos\n• Chance de ganhar acessórios extras\n• Mix dourado e prata\n• Vídeo exclusivo\n• Até 3 trocas\n\nCada scoop é preparado com carinho para proporcionar uma experiência única.",
    scoop: { items: 6, extra: true, exchanges: 3 },
    isBestseller: true,
  },
  {
    id: "scoop-3",
    name: "Coleção de Sonhos",
    price: 289.90,
    image: "/images/scoop-3.jpg",
    badge: "Novo",
    category: "Scoop",
    rating: 4.8,
    reviews: 187,
    description: "Se você ama acessórios e adora uma boa surpresa, esse scoop foi feito para você.\n\nVocê recebe:\n• 9 acessórios garantidos\n• Chance de ganhar acessórios extras\n• Mix dourado e prata\n• Vídeo exclusivo\n• Até 4 trocas\n\nUma experiência pensada para renovar sua coleção.",
    scoop: { items: 9, extra: true, exchanges: 4 },
    isNew: true,
  },
  {
    id: "scoop-4",
    name: "Experiência Premium",
    price: 349.90,
    image: "/images/scoop-4.jpg",
    badge: "Premium",
    category: "Scoop",
    rating: 5.0,
    reviews: 94,
    description: "O nível máximo da experiência Lisory.\n\nVocê recebe:\n• 12 acessórios garantidos\n• Chance de ganhar acessórios extras\n• Mix dourado e prata\n• Vídeo exclusivo\n• Até 5 trocas\n\nMais acessórios, mais surpresas e muito mais emoção.",
    scoop: { items: 12, extra: true, exchanges: 5 },
    isBestseller: true,
  },
  {
    id: "colar-sweet-cherry",
    name: "Colar Sweet Cherry",
    price: 69.9,
    image: "/images/ColarSweetcherry.png",
    category: "Colares",
    rating: 5.0,
    reviews: 0,
    description: "Colar Sweet Cherry - A elegância em forma de pingente.\n\nUma peça delicada e cheia de personalidade para complementar seu visual.",
    isNew: true,
  },
];

const slugMap: Record<string, string> = {
  "primeira-surpresa": "scoop-1",
  "brilho-em-dobro": "scoop-2",
  "colecao-de-sonhos": "scoop-3",
  "experiencia-premium": "scoop-4",
};

export const testimonials: Testimonial[] = [
  { name: "Ana Beatriz M.", text: "Comprei o Primeira Surpresa e foi a melhor experiência! Cada peça era mais linda que a outra. O vídeo da abertura é um charme extra.", rating: 5, location: "São Paulo, SP" },
  { name: "Camila R.", text: "O Brilho em Dobro superou minhas expectativas. 6 acessórios perfeitos, mix dourado e prata impecável. Já quero o próximo!", rating: 5, location: "Rio de Janeiro, RJ" },
  { name: "Fernanda L.", text: "Experiência Premium é tudo! 12 acessórios maravilhosos, embalagem luxuosa, vídeo exclusivo... Vale cada centavo!", rating: 5, location: "Belo Horizonte, MG" },
  { name: "Juliana F.", text: "O Coleção de Sonhos foi simplesmente perfeito. 9 acessórios lindos, mix dourado e prata impecável. Amei cada peça!", rating: 5, location: "São Paulo, SP" },
];

export const faqItems: FaqItem[] = [
  { q: "O que é um Scoop Lisory?", a: "Scoop é uma experiência surpresa de acessórios. Você escolhe o nível, e nós montamos uma seleção especial de peças mix dourado e prata pensadas para você. Cada scoop é único!" },
  { q: "Quantos acessórios vêm em cada Scoop?", a: "Temos 4 opções: Primeira Surpresa (4 acessórios), Brilho em Dobro (6 acessórios), Coleção de Sonhos (9 acessórios) e Experiência Premium (12 acessórios)." },
  { q: "Posso trocar alguma peça se não gostar?", a: "Sim! Dependendo do scoop escolhido, você pode trocar de 2 a 5 peças. Basta entrar em contato com nosso suporte." },
  { q: "Como funciona o vídeo exclusivo?", a: "Ao adquirir qualquer scoop, gravamos um vídeo especial da abertura da sua seleção, para você reviver a emoção sempre que quiser." },
  { q: "Qual o prazo de entrega?", a: "Enviamos para todo o Brasil. O prazo médio é de 3 a 7 dias úteis para as capitais e 5 a 10 dias úteis para demais regiões." },
  { q: "Posso ganhar acessórios extras?", a: "Sim! Durante a abertura do seu scoop, você tem chances de ganhar acessórios extras surpresa. Quanto maior o scoop, maiores as chances!" },
];

export function getProductById(id: string): Product | undefined {
  const resolvedId = slugMap[id] || id;
  return products.find((p) => p.id === resolvedId);
}

export function getRelatedProducts(id: string): Product[] {
  return products.filter((p) => p.id !== id).slice(0, 4);
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.isBestseller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}
