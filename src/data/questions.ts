import { Question } from '../types/quiz';

export const questions: Question[] = [
  // Genel Kültür Soruları
  {
    id: 1,
    category: 'general',
    question: "Türkiye'nin başkenti neresidir?",
    options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    correctAnswer: "Ankara"
  },
  {
    id: 2,
    category: 'general',
    question: "İnsan vücudundaki en büyük organ hangisidir?",
    options: ["Kalp", "Beyin", "Deri", "Karaciğer"],
    correctAnswer: "Deri"
  },
  {
    id: 3,
    category: 'general',
    question: "Hangi yıl Türkiye Cumhuriyeti kurulmuştur?",
    options: ["1920", "1921", "1922", "1923"],
    correctAnswer: "1923"
  },
  {
    id: 4,
    category: 'general',
    question: "Nobel ödülleri hangi ülkede verilmektedir?",
    options: ["Norveç", "İsveç", "Danimarka", "Finlandiya"],
    correctAnswer: "İsveç"
  },

  // Bilim & Teknoloji Soruları
  {
    id: 5,
    category: 'science',
    question: "Hangi gezegen güneş sisteminde en büyüktür?",
    options: ["Mars", "Venüs", "Jüpiter", "Satürn"],
    correctAnswer: "Jüpiter"
  },
  {
    id: 6,
    category: 'science',
    question: "Hangisi bir programlama dili değildir?",
    options: ["Python", "Java", "HTML", "Ruby"],
    correctAnswer: "HTML"
  },
  {
    id: 7,
    category: 'science',
    question: "İnsan DNA'sı kaç kromozom çiftinden oluşur?",
    options: ["21", "22", "23", "24"],
    correctAnswer: "23"
  },
  {
    id: 8,
    category: 'science',
    question: "Işık hangi ortamda daha hızlı hareket eder?",
    options: ["Su", "Hava", "Cam", "Vakum"],
    correctAnswer: "Vakum"
  },

  // Tarih Soruları
  {
    id: 9,
    category: 'history',
    question: "İstanbul'un fethi hangi yılda gerçekleşmiştir?",
    options: ["1453", "1454", "1455", "1456"],
    correctAnswer: "1453"
  },
  {
    id: 10,
    category: 'history',
    question: "I. Dünya Savaşı hangi yılda başlamıştır?",
    options: ["1913", "1914", "1915", "1916"],
    correctAnswer: "1914"
  },
  {
    id: 11,
    category: 'history',
    question: "Hangi uygarlık yazıyı ilk kullanan uygarlıktır?",
    options: ["Sümerler", "Mısırlılar", "Hititler", "Asurlular"],
    correctAnswer: "Sümerler"
  },
  {
    id: 12,
    category: 'history',
    question: "Malazgirt Savaşı hangi yılda yapılmıştır?",
    options: ["1071", "1073", "1075", "1077"],
    correctAnswer: "1071"
  },

  // Coğrafya Soruları
  {
    id: 13,
    category: 'geography',
    question: "Türkiye'nin en yüksek dağı hangisidir?",
    options: ["Ağrı Dağı", "Erciyes Dağı", "Uludağ", "Palandöken Dağı"],
    correctAnswer: "Ağrı Dağı"
  },
  {
    id: 14,
    category: 'geography',
    question: "Dünyanın en büyük okyanusu hangisidir?",
    options: ["Atlas Okyanusu", "Hint Okyanusu", "Pasifik Okyanusu", "Arktik Okyanusu"],
    correctAnswer: "Pasifik Okyanusu"
  },
  {
    id: 15,
    category: 'geography',
    question: "Hangi ülke yüzölçümü bakımından dünyada en büyüktür?",
    options: ["Çin", "ABD", "Kanada", "Rusya"],
    correctAnswer: "Rusya"
  },
  {
    id: 16,
    category: 'geography',
    question: "Amazon Nehri hangi kıtadadır?",
    options: ["Asya", "Afrika", "Güney Amerika", "Kuzey Amerika"],
    correctAnswer: "Güney Amerika"
  },

  // Spor Soruları
  {
    id: 17,
    category: 'sports',
    question: "Bir futbol maçı kaç dakika sürer?",
    options: ["80", "85", "90", "95"],
    correctAnswer: "90"
  },
  {
    id: 18,
    category: 'sports',
    question: "Hangi spor dalında 'Grand Slam' turnuvaları düzenlenir?",
    options: ["Futbol", "Basketbol", "Tenis", "Voleybol"],
    correctAnswer: "Tenis"
  },
  {
    id: 19,
    category: 'sports',
    question: "NBA hangi spor dalının profesyonel ligi?",
    options: ["Futbol", "Basketbol", "Beyzbol", "Amerikan Futbolu"],
    correctAnswer: "Basketbol"
  },
  {
    id: 20,
    category: 'sports',
    question: "Bir voleybol takımında kaç oyuncu sahada bulunur?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "6"
  },

  // Sanat & Edebiyat Soruları
  {
    id: 21,
    category: 'arts',
    question: "Mona Lisa tablosunun ressamı kimdir?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    id: 22,
    category: 'arts',
    question: "Hangisi William Shakespeare'in bir eseri değildir?",
    options: ["Hamlet", "Romeo ve Juliet", "Sefiller", "Macbeth"],
    correctAnswer: "Sefiller"
  },
  {
    id: 23,
    category: 'arts',
    question: "'Suç ve Ceza' romanının yazarı kimdir?",
    options: ["Tolstoy", "Dostoyevski", "Çehov", "Gogol"],
    correctAnswer: "Dostoyevski"
  },
  {
    id: 24,
    category: 'arts',
    question: "Van Gogh'un en ünlü tablolarından biri hangisidir?",
    options: ["Yıldızlı Gece", "Son Akşam Yemeği", "Çığlık", "Guernica"],
    correctAnswer: "Yıldızlı Gece"
  }
]; 