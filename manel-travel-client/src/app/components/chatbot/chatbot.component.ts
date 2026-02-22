import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  options?: QuickOption[];
}

interface QuickOption {
  label: string;
  icon: string;
  route?: string;
  reply?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-wrap">
      <!-- Floating Toggle -->
      <button
        class="fab"
        (click)="toggle()"
        *ngIf="!isOpen"
        aria-label="Open chat"
      >
        <span class="fab-icon">💬</span>
      </button>

      <!-- Chat Panel -->
      <div class="panel" *ngIf="isOpen">
        <!-- Header -->
        <div class="panel-header">
          <div class="header-left">
            <span class="avatar">🤖</span>
            <div>
              <strong>Manel AI</strong>
              <span class="online">● Online</span>
            </div>
          </div>
          <button class="close" (click)="toggle()" aria-label="Close chat">
            ✕
          </button>
        </div>

        <!-- Messages -->
        <div class="messages" #msgContainer>
          <div
            *ngFor="let m of messages"
            class="msg"
            [class.from-user]="m.sender === 'user'"
            [class.from-bot]="m.sender === 'bot'"
          >
            <span class="bot-dot" *ngIf="m.sender === 'bot'">🤖</span>
            <div class="bubble">{{ m.text }}</div>
          </div>

          <!-- Quick Options -->
          <div class="quick-options" *ngIf="lastBotOptions.length > 0">
            <button
              *ngFor="let o of lastBotOptions"
              (click)="pickOption(o)"
              class="opt-btn"
            >
              <span>{{ o.icon }}</span> {{ o.label }}
            </button>
          </div>

          <!-- Typing -->
          <div class="typing" *ngIf="isTyping">
            <span></span><span></span><span></span>
          </div>
        </div>

        <!-- Input -->
        <div class="input-bar">
          <input
            type="text"
            placeholder="Type a message..."
            [(ngModel)]="currentInput"
            (keyup.enter)="send()"
          />
          <button
            class="send-btn"
            (click)="send()"
            [disabled]="!currentInput.trim()"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .chatbot-wrap {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        font-family: 'Poppins', sans-serif;
      }

      /* ─ FAB ─ */
      .fab {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(15, 185, 177, 0.45);
        transition:
          transform 0.25s,
          box-shadow 0.25s;
      }
      .fab:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 24px rgba(15, 185, 177, 0.55);
      }
      .fab-icon {
        font-size: 1.5rem;
      }

      /* ─ Panel ─ */
      .panel {
        width: 370px;
        height: 520px;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.14);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: popIn 0.3s ease;
        border: 1px solid #e8ecef;
      }
      @keyframes popIn {
        from {
          opacity: 0;
          transform: translateY(16px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* ─ Header ─ */
      .panel-header {
        background: linear-gradient(135deg, #1e272e, #2d3436);
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .avatar {
        font-size: 1.6rem;
        background: rgba(255, 255, 255, 0.1);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .panel-header strong {
        display: block;
        font-size: 0.95rem;
      }
      .online {
        font-size: 0.72rem;
        color: #0fb9b1;
      }
      .close {
        background: rgba(255, 255, 255, 0.08);
        border: none;
        color: rgba(255, 255, 255, 0.6);
        width: 30px;
        height: 30px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
      }
      .close:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
      }

      /* ─ Messages ─ */
      .messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background: #f8f9fb;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .messages::-webkit-scrollbar {
        width: 4px;
      }
      .messages::-webkit-scrollbar-thumb {
        background: #dfe6e9;
        border-radius: 4px;
      }

      .msg {
        display: flex;
        gap: 8px;
        max-width: 82%;
        animation: fadeMsg 0.25s ease;
      }
      @keyframes fadeMsg {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .msg.from-bot {
        align-self: flex-start;
      }
      .msg.from-user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .bot-dot {
        font-size: 1rem;
        flex-shrink: 0;
        margin-top: 4px;
      }

      .bubble {
        padding: 10px 14px;
        border-radius: 14px;
        font-size: 0.88rem;
        line-height: 1.55;
      }
      .from-bot .bubble {
        background: #fff;
        color: #2d3436;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.04);
      }
      .from-user .bubble {
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        border-bottom-right-radius: 4px;
      }

      /* ─ Quick Options ─ */
      .quick-options {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-left: 28px;
      }
      .opt-btn {
        background: #fff;
        border: 1px solid #e8ecef;
        padding: 7px 14px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 500;
        color: #0fb9b1;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .opt-btn:hover {
        background: #0fb9b1;
        color: #fff;
        border-color: #0fb9b1;
      }

      /* ─ Typing ─ */
      .typing {
        align-self: flex-start;
        background: #fff;
        padding: 10px 16px;
        border-radius: 14px;
        display: flex;
        gap: 5px;
        margin-left: 28px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.04);
      }
      .typing span {
        width: 7px;
        height: 7px;
        background: #b2bec3;
        border-radius: 50%;
        animation: dot 1.4s infinite ease-in-out both;
      }
      .typing span:nth-child(1) {
        animation-delay: -0.32s;
      }
      .typing span:nth-child(2) {
        animation-delay: -0.16s;
      }
      @keyframes dot {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }

      /* ─ Input ─ */
      .input-bar {
        padding: 12px 14px;
        background: #fff;
        border-top: 1px solid #e8ecef;
        display: flex;
        gap: 8px;
      }
      .input-bar input {
        flex: 1;
        border: 2px solid #e8ecef;
        border-radius: 22px;
        padding: 10px 16px;
        font-size: 0.88rem;
        font-family: inherit;
        color: #1e272e;
        outline: none;
        transition: border-color 0.2s;
      }
      .input-bar input:focus {
        border-color: #0fb9b1;
      }
      .input-bar input::placeholder {
        color: #b2bec3;
      }
      .send-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #0fb9b1, #0a8d87);
        color: #fff;
        font-size: 1.05rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .send-btn:hover:not(:disabled) {
        transform: scale(1.08);
      }
      .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 480px) {
        .panel {
          width: calc(100vw - 24px);
          height: calc(100vh - 100px);
          border-radius: 14px;
        }
        .chatbot-wrap {
          right: 12px;
          bottom: 12px;
        }
      }
    `,
  ],
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('msgContainer') private msgContainer!: ElementRef;

  isOpen = false;
  currentInput = '';
  isTyping = false;
  lastBotOptions: QuickOption[] = [];

  messages: ChatMessage[] = [
    {
      text: "👋 Hi! I'm your ManelTravel assistant. How can I help you today?",
      sender: 'bot',
      options: [
        { label: 'Browse Packages', icon: '🎒', route: '/packages' },
        { label: 'My Bookings', icon: '🎫', route: '/my-bookings' },
        { label: 'Pricing Info', icon: '💰', reply: 'price' },
        { label: 'Contact Us', icon: '📞', reply: 'contact' },
      ],
    },
  ];

  constructor(private router: Router) {
    this.lastBotOptions = this.messages[0].options || [];
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      const el = this.msgContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch (_) {}
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  send() {
    const text = this.currentInput.trim();
    if (!text) return;

    this.messages.push({ text, sender: 'user' });
    this.currentInput = '';
    this.lastBotOptions = [];
    this.isTyping = true;

    setTimeout(
      () => {
        this.isTyping = false;
        this.respond(text.toLowerCase());
      },
      800 + Math.random() * 400,
    );
  }

  pickOption(opt: QuickOption) {
    if (opt.route) {
      this.messages.push({ text: opt.label, sender: 'user' });
      this.lastBotOptions = [];
      this.isTyping = true;
      setTimeout(() => {
        this.isTyping = false;
        this.messages.push({
          text: `Taking you to ${opt.label} now! ✨`,
          sender: 'bot',
        });
        setTimeout(() => this.router.navigate([opt.route!]), 500);
      }, 500);
    } else if (opt.reply) {
      this.messages.push({ text: opt.label, sender: 'user' });
      this.lastBotOptions = [];
      this.isTyping = true;
      setTimeout(() => {
        this.isTyping = false;
        this.respond(opt.reply!);
      }, 800);
    }
  }

  private respond(input: string) {
    const msg: ChatMessage = { text: '', sender: 'bot' };

    if (
      input.includes('hello') ||
      input.includes('hi') ||
      input.includes('hey')
    ) {
      msg.text = 'Hello there! 😊 Ready to plan your next adventure?';
      msg.options = [
        { label: 'Show Packages', icon: '🎒', route: '/packages' },
        { label: 'Help me choose', icon: '🤔', reply: 'recommend' },
      ];
    } else if (
      input.includes('package') ||
      input.includes('tour') ||
      input.includes('recommend')
    ) {
      msg.text =
        'We have amazing tours — Anuradhapura pilgrimage, Ella adventure, Sigiriya heritage, Bali tropical escape and more! 🌴';
      msg.options = [
        { label: 'View All Packages', icon: '🎒', route: '/packages' },
        { label: 'Pricing Info', icon: '💰', reply: 'price' },
      ];
    } else if (
      input.includes('price') ||
      input.includes('cost') ||
      input.includes('cheap') ||
      input.includes('budget')
    ) {
      msg.text =
        'Our packages range from Rs. 15,000 to Rs. 200,000+ depending on destination and duration. We have options for every budget! 💰';
      msg.options = [
        { label: 'Browse Packages', icon: '🎒', route: '/packages' },
      ];
    } else if (
      input.includes('contact') ||
      input.includes('support') ||
      input.includes('help') ||
      input.includes('phone') ||
      input.includes('email')
    ) {
      msg.text =
        "📧 info@maneltravel.com\n📞 +94 77 123 4567\n📍 Colombo, Sri Lanka\n\nWe're available Mon–Sat, 9am–6pm!";
    } else if (input.includes('book') || input.includes('reserve')) {
      msg.text =
        'To book a package: go to Packages → pick your tour → fill in participants → confirm! You need to be signed in. 🎫';
      msg.options = [
        { label: 'Browse Packages', icon: '🎒', route: '/packages' },
        { label: 'My Bookings', icon: '🎫', route: '/my-bookings' },
      ];
    } else if (input.includes('cancel')) {
      msg.text =
        'You can cancel Pending or Confirmed bookings from your My Bookings page. Just click the Cancel button on the booking card.';
      msg.options = [
        { label: 'My Bookings', icon: '🎫', route: '/my-bookings' },
      ];
    } else if (
      input.includes('login') ||
      input.includes('sign') ||
      input.includes('account') ||
      input.includes('register')
    ) {
      msg.text =
        'You can sign in or create a new account to start booking tours!';
      msg.options = [
        { label: 'Sign In', icon: '🔑', route: '/login' },
        { label: 'Register', icon: '📝', route: '/register' },
      ];
    } else if (input.includes('thank')) {
      msg.text = "You're welcome! Have a wonderful trip! 🌍✨";
    } else if (input.includes('bye') || input.includes('goodbye')) {
      msg.text =
        'Goodbye! Come back anytime you need help planning. Safe travels! ✈️';
    } else {
      msg.text =
        "I'm not sure about that, but I can help with packages, bookings, pricing, or contact info! Try one of these:";
      msg.options = [
        { label: 'Browse Packages', icon: '🎒', route: '/packages' },
        { label: 'Pricing Info', icon: '💰', reply: 'price' },
        { label: 'Contact Us', icon: '📞', reply: 'contact' },
      ];
    }

    this.messages.push(msg);
    this.lastBotOptions = msg.options || [];
  }
}
