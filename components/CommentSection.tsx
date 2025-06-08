import React from 'react';

interface CommentProps {
  author: string;
  content: string;
  date: string;
}

const Comment: React.FC<CommentProps> = ({ author, content, date }) => {
  return (
    <div className="bg-[#0f1019] p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-[#6c5ce7] rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          {author.charAt(0).toUpperCase()}
        </div>
        <h4 className="font-semibold text-white">{author}</h4>
        <span className="text-gray-500 text-xs ml-auto">{date}</span>
      </div>
      <p className="text-gray-300">{content}</p>
    </div>
  );
};

export default function CommentSection() {
  // Dummy comments for demonstration
  const comments = [
    {
      author: "Kullanıcı1",
      content: "Harika bir manga, çok sürükleyici! Okumaya doyamıyorum.",
      date: "1 gün önce",
    },
    {
      author: "MangaSever",
      content: "Çizimler çok güzel, hikaye de fena değil.",
      date: "3 gün önce",
    },
    {
      author: "Okuyucu2",
      content: "Yeni bölüm ne zaman gelir? Sabırsızlıkla bekliyorum!",
      date: "1 hafta önce",
    },
  ];

  return (
    <div className="card p-6 mt-8">
      <h2 className="text-3xl font-bold gradient-text mb-6">Yorumlar</h2>
      
      {/* Comment Input */}
      <div className="mb-8">
        <textarea
          className="input-primary w-full h-24 p-3 rounded-lg mb-4"
          placeholder="Yorumunuzu buraya yazın..."
        ></textarea>
        <button className="btn-primary">Yorum Yap</button>
      </div>

      {/* Comments List */}
      <div>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Comment key={index} author={comment.author} content={comment.content} date={comment.date} />
          ))
        ) : (
          <p className="text-gray-400 text-center">Henüz yorum yok. İlk yorumu siz yapın!</p>
        )}
      </div>
    </div>
  );
} 