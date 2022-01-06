import 'regenerator-runtime/runtime';

// Mock useNavigate because it is usable only inside a react-dom router, not possible in tests
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));