import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentionalsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password must contain Uppercase characters (A-Z), Lowercase characters (a-z), Digits (0-9) and Special characters (~! @#$%^&*_-+=\`|\(){}[]:;"'<>,.?/)`,
  })
  password: string;
}
