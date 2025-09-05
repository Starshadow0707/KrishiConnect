import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ChatInterface />
      </main>
    </div>
  );
};

export default Chat;