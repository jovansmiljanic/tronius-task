import "../styles.css";
import Phaser from "phaser";
import { SlotMachineScene } from "./scenes/SlotMachineScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 500,
  height: 600,
  scene: SlotMachineScene,
  parent: "game-container",
};

new Phaser.Game(config);
