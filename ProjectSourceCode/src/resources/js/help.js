Talk.ready.then(function () {
    const user = new Talk.User({
        id: 'user',
        name: 'User',
        photoUrl: 'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png',
      });
    
    const session = new Talk.Session({
      appId: 'twPXuf7Y', // replace with your app ID
      me: user,
    });
    
    const admin = new Talk.User({
        id: 'admin',
        name: 'Admin',
        photoUrl: 'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png',
        welcomeMessage: 'How may I assist you?',
      });

    const conversation = session.getOrCreateConversation('new_conversation');
    conversation.setParticipant(user);
    conversation.setParticipant(admin);

    const chatbox = session.createChatbox();
    chatbox.select(conversation);
    chatbox.mount(document.getElementById('talkjs-container'));
  });