// Test Suite
describe("Description of test suite", function() {
  var game;
  // before each test case
  beforeEach(function() {
    game = new Game(7);
  });
  // test case
  it("description of test case", function() {
    expect(game.totalGuesses).toEqual(7);
  });
});