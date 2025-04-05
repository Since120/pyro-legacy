import { Client, Events, GatewayIntentBits, GuildChannel } from 'discord.js';
import type { RedisPubSub } from './pubsub-client';
import { EventService } from '../services/event-service';

export class DiscordClient {
  private client: Client;
  
  constructor(
    private pubSub: RedisPubSub,
    private eventService: EventService
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
      ]
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user?.tag}!`);
      this.pubSub.subscribe('categoryUpdates', (message) =>
        this.eventService.handleCategoryEvent(JSON.parse(message)));
      this.pubSub.subscribe('zoneUpdates', (message) =>
        this.eventService.handleZoneEvent(JSON.parse(message)));
    });

    this.client.on(Events.ChannelUpdate, (oldChannel, newChannel) => {
      if (oldChannel instanceof GuildChannel && newChannel instanceof GuildChannel) {
        this.eventService.handleChannelUpdate(oldChannel, newChannel);
      }
    });
  }

  public async login(token: string) {
    await this.client.login(token);
  }
}