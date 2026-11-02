// Detail skenario hanya ada di server. Browser hanya menerima judul, deskripsi, dan sapaan.
export const SKENARIO = {
  checkin: {
    judul: "Check-in di homestay Ubud",
    deskripsi: "Tamu datang, tapi reservasinya tidak ditemukan.",
    sapaan: "Hi there! I'd like to check in, please. The name is Sarah Miller.",
    persona: "Sarah Miller, 34, a friendly but tired traveler from Australia who just arrived after a long flight.",
    situasi: "You arrive at a small family-run homestay in Ubud. You booked a room online for 3 nights. When the staff checks, they will not find your reservation in their system. Do not mention any booking problem until the staff tells you about it.",
    tujuan: "Get a room for tonight. You have the booking confirmation email on your phone if the staff asks for it."
  },
  komplain: {
    judul: "Tamu komplain AC mati",
    deskripsi: "Tamu kesal karena kamarnya panas.",
    sapaan: "Excuse me, the air conditioner in my room isn't working. It's really hot in there!",
    persona: "Mark Jensen, 45, a businessman from Germany. Direct and a bit impatient because he is tired and has a meeting tomorrow.",
    situasi: "You are staying at a hotel in Kuta. The air conditioner in room 214 stopped working.",
    tujuan: "Get the AC fixed quickly or move to another room. Calm down if the staff apologizes sincerely and offers a clear solution."
  },
  pura: {
    judul: "Menjelaskan etika masuk pura",
    deskripsi: "Turis ingin masuk pura memakai celana pendek.",
    sapaan: "Hello! Can I go inside the temple now? I'm wearing shorts, is that okay?",
    persona: "Emma Clark, 22, a curious and polite backpacker from the UK visiting a temple in Bali for the first time.",
    situasi: "You are at the entrance of a Balinese temple, wearing shorts and a T-shirt.",
    tujuan: "Understand what you need to wear to enter the temple, where to get it, and why it matters."
  }
};