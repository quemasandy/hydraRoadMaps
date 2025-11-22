
// Importamos la clase a testear (SUT - System Under Test).
import { CreateUserUseCase } from "./CreateUser.usecase";
// Importamos las interfaces para mockearlas.
import { UserRepository } from "../domain/UserRepository";
import { EmailService } from "../domain/EmailService";
import { User } from "../domain/User";

// Creamos Mocks (dobles de prueba) de las dependencias.
// Usamos jest.fn() para poder espiar si fueron llamados.
const mockUserRepo: UserRepository = {
  exists: jest.fn(),
  save: jest.fn()
};

const mockEmailService: EmailService = {
  sendWelcomeEmail: jest.fn()
};

// Suite de pruebas para CreateUserUseCase.
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;

  // beforeEach se ejecuta antes de CADA test individual.
  beforeEach(() => {
    // Limpiamos los mocks para que no guarden estado de tests anteriores.
    jest.clearAllMocks();
    // Instanciamos el caso de uso inyectando los mocks.
    useCase = new CreateUserUseCase(mockUserRepo, mockEmailService);
  });

  // Test 1: Camino feliz.
  it('should create a user successfully when email is unique', async () => {
    // Arrange (Preparación): Configuramos el mock para que diga que el usuario NO existe.
    (mockUserRepo.exists as jest.Mock).mockResolvedValue(false);
    const request = { email: 'test@example.com', password: 'password123' };

    // Act (Ejecución): Llamamos al método.
    const result = await useCase.execute(request);

    // Assert (Verificación):
    // 1. El resultado debe ser exitoso.
    expect(result.isSuccess).toBe(true);
    // 2. Se debió llamar a save() una vez.
    expect(mockUserRepo.save).toHaveBeenCalledTimes(1);
    // 3. Se debió enviar el email de bienvenida al correo correcto.
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('test@example.com');
  });

  // Test 2: Usuario duplicado.
  it('should fail when user already exists', async () => {
    // Arrange: Configuramos el mock para que diga que el usuario SÍ existe.
    (mockUserRepo.exists as jest.Mock).mockResolvedValue(true);
    const request = { email: 'existing@example.com', password: 'password123' };

    // Act
    const result = await useCase.execute(request);

    // Assert
    // 1. El resultado debe ser fallido.
    expect(result.isFailure).toBe(true);
    // 2. El mensaje de error debe ser el esperado.
    expect(result.errorValue()).toBe("User already exists");
    // 3. NO se debió guardar nada.
    expect(mockUserRepo.save).not.toHaveBeenCalled();
    // 4. NO se debió enviar email.
    expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
  });

  // Test 3: Validación de Dominio fallida.
  it('should fail when email is invalid (Domain Logic)', async () => {
    // Arrange
    (mockUserRepo.exists as jest.Mock).mockResolvedValue(false);
    // Email inválido (sin @).
    const request = { email: 'invalid-email', password: 'password123' };

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    // El error viene de la Entidad User, no del caso de uso directamente.
    expect(result.errorValue()).toBe("Invalid email address"); 
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });
});
