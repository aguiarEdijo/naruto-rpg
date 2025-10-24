// Sistema de rolagem de dados com evolução por nível

import { getDiceForLevel } from './levelSystem';

export interface DiceRoll {
    dice: number[];
    total: number;
    modifier: number;
    finalResult: number;
    diceType: string; // Descrição dos dados usados
}

export interface RollResult {
    success: boolean;
    criticalSuccess: boolean;
    criticalFailure: boolean;
    margin: number;
}

export class DiceSystem {
    private static readonly MIN_ROLL = 2;
    private static readonly MAX_ROLL = 24; // Máximo com 2d12

    /**
     * Rola dados baseado no nível do personagem
     */
    static rollByLevel(level: number, modifier: number = 0): DiceRoll {
        const diceConfig = getDiceForLevel(level);
        const dice: number[] = [];
        let total = 0;

        for (let i = 0; i < diceConfig.dice.length; i++) {
            const roll = Math.floor(Math.random() * diceConfig.dice[i]) + 1;
            dice.push(roll);
            total += roll;
        }

        const finalResult = total + modifier;

        return {
            dice,
            total,
            modifier,
            finalResult,
            diceType: diceConfig.description,
        };
    }

    /**
     * Rola 2d6 (método tradicional para compatibilidade)
     */
    static roll2d6(modifier: number = 0): DiceRoll {
        return this.rollByLevel(1, modifier);
    }

    /**
     * Verifica se o resultado é um sucesso baseado na dificuldade
     */
    static checkSuccess(roll: DiceRoll, difficulty: number): RollResult {
        const { finalResult } = roll;
        const margin = finalResult - difficulty;

        const criticalSuccess = finalResult >= roll.total + roll.modifier; // Sucesso crítico = máximo possível
        const criticalFailure = finalResult <= roll.modifier + 2; // Falha crítica = mínimo possível
        const success = finalResult >= difficulty;

        return {
            success,
            criticalSuccess,
            criticalFailure,
            margin,
        };
    }

    /**
     * Rola para uma perícia específica com nível
     */
    static rollSkill(skillValue: number, difficulty: number = 8, level: number = 1): {
        roll: DiceRoll;
        result: RollResult;
    } {
        const roll = this.rollByLevel(level, skillValue);
        const result = this.checkSuccess(roll, difficulty);

        return { roll, result };
    }

    /**
     * Rola para combate (ataque vs defesa) com níveis
     */
    static rollCombat(attackValue: number, defenseValue: number, attackerLevel: number = 1, defenderLevel: number = 1): {
        attackRoll: DiceRoll;
        defenseRoll: DiceRoll;
        damage: number;
    } {
        const attackRoll = this.rollByLevel(attackerLevel, attackValue);
        const defenseRoll = this.rollByLevel(defenderLevel, defenseValue);

        const damage = Math.max(0, attackRoll.finalResult - defenseRoll.finalResult);

        return {
            attackRoll,
            defenseRoll,
            damage,
        };
    }

    /**
     * Rola para resistência a Genjutsu com níveis
     */
    static rollGenjutsuResistance(resistanceValue: number, genjutsuPower: number, defenderLevel: number = 1, attackerLevel: number = 1): {
        resistanceRoll: DiceRoll;
        genjutsuRoll: DiceRoll;
        resisted: boolean;
    } {
        const resistanceRoll = this.rollByLevel(defenderLevel, resistanceValue);
        const genjutsuRoll = this.rollByLevel(attackerLevel, genjutsuPower);

        const resisted = resistanceRoll.finalResult >= genjutsuRoll.finalResult;

        return {
            resistanceRoll,
            genjutsuRoll,
            resisted,
        };
    }

    /**
     * Calcula modificador de controle de chakra baseado no nível
     */
    static calculateChakraControlModifier(chakraControl: number, level: number): number {
        const baseModifier = Math.floor(chakraControl / 4);
        const levelBonus = Math.floor(level / 5); // +1 a cada 5 níveis

        return baseModifier + levelBonus;
    }

    /**
     * Aplica modificador de controle de chakra ao custo
     */
    static applyChakraControl(cost: number, chakraControl: number, level: number = 1): number {
        const modifier = this.calculateChakraControlModifier(chakraControl, level);
        return Math.max(1, cost - modifier);
    }

    /**
     * Calcula dificuldade para combate em grupo
     */
    static calculateGroupCombatDifficulty(baseDifficulty: number, groupSize: number, levelDifference: number): number {
        const sizeMultiplier = Math.min(1 + (groupSize - 1) * 0.2, 2.0); // Máximo 2x
        const levelPenalty = Math.max(0, levelDifference - 3) * 2;

        return Math.round(baseDifficulty * sizeMultiplier + levelPenalty);
    }
}
