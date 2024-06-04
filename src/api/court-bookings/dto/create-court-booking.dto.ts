import { ApiProperty } from '@nestjs/swagger';

export class CourtBookingDto {
  @ApiProperty({
    type: String,
  })
  public phone: string;

  @ApiProperty({
    type: Boolean,
  })
  public is_block: boolean;

  @ApiProperty({
    type: Boolean,
  })
  public is_active: boolean;

  @ApiProperty({
    type: String,
  })
  public first_name: string;

  @ApiProperty({
    type: String,
  })
  public last_name: string;

  @ApiProperty({
    type: String,
  })
  public email: string;

  @ApiProperty({
    type: String,
  })
  public courtId: string;
}
