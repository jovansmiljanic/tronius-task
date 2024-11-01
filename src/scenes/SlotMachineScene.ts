import Phaser from "phaser";

export class SlotMachineScene extends Phaser.Scene {
  private reels: Phaser.GameObjects.TileSprite[] = [];
  private spinButton!: Phaser.GameObjects.Text;
  private spinningReels: Set<Phaser.GameObjects.TileSprite> = new Set();

  private readonly symbolHeight = 140;
  private readonly totalSymbols = 3;
  private readonly reelWidth = 145;
  private readonly spinDuration = 2000;
  private readonly spinDelay = 200;
  private readonly speed = -20;

  constructor() {
    super("SlotMachineScene");
  }

  preload() {
    this.load.image("symbols", "../public/symbols/symbols.png");
  }

  create() {
    this.createReels();
    this.createSpinButton();
    this.addBorder();
  }

  // Create and position the reels of the slot machine and handle it with Tile Sprite
  private createReels() {
    const startX = this.scale.width / 2 - this.reelWidth;
    const startY = 0;

    for (let i = 0; i < 3; i++) {
      const reel = this.add.tileSprite(
        startX + i * this.reelWidth,
        startY,
        this.reelWidth,
        this.symbolHeight * this.totalSymbols,
        "symbols"
      );
      reel.setOrigin(0.5, 0);
      this.reels.push(reel);
    }
  }

  // Create the spin button and set up interaction
  private createSpinButton() {
    this.spinButton = this.add
      .text(this.scale.width / 2, this.scale.height - 100, "Spin", {
        fontSize: "36px",
        color: "#FFF",
        backgroundColor: "#FF0000",
        padding: { x: 20, y: 10 },
        align: "center",
        fixedWidth: 150,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.spinReels());
  }

  // Add a border to visually frame the slot machine reels
  private addBorder() {
    const borderWidth = 5;
    const borderColor = 0xffffff;

    this.add
      .rectangle(
        this.scale.width / 2,
        150 + this.symbolHeight * 3 + borderWidth / 2,
        this.reelWidth * 3 + borderWidth * 2,
        borderWidth,
        borderColor
      )
      .setOrigin(0.5, 30);
  }

  // Handle the spin button click and start spinning the reels
  private spinReels() {
    this.spinButton.disableInteractive();
    this.reels.forEach((reel, reelIndex) => {
      const delay = reelIndex * this.spinDelay;
      this.time.delayedCall(delay, () => {
        this.spinningReels.add(reel);
        this.animateReel(reel);
      });
    });
  }

  // Animate a single reel to spin for the specified duration
  private animateReel(reel: Phaser.GameObjects.TileSprite) {
    const startTime = this.time.now;

    const timer = this.time.addEvent({
      delay: 10,
      loop: true,
      callback: () => {
        if (this.time.now - startTime >= this.spinDuration) {
          timer.remove();
          this.stopReel(reel);
          this.spinningReels.delete(reel);
          if (this.spinningReels.size === 0) {
            this.spinButton.setInteractive();
          }
        } else {
          reel.tilePositionY += this.speed;
          reel.tilePositionY =
            (reel.tilePositionY + this.symbolHeight * this.totalSymbols) %
            (this.symbolHeight * this.totalSymbols);
        }
      },
    });
  }

  // Stop the reel at a random symbol position
  private stopReel(reel: Phaser.GameObjects.TileSprite) {
    const symbolIndex = Phaser.Math.Between(0, this.totalSymbols - 1);
    reel.tilePositionY = symbolIndex * this.symbolHeight;
  }
}
