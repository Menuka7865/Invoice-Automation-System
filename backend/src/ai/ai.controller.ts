import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private ai: AiService) {}

  @Get('insights')
  async insights() {
    return this.ai.summarize();
  }
}
