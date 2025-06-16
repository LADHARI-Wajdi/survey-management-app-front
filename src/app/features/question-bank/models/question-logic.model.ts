// features/question-bank/models/question-logic.model.ts

// Énumération des types d'opérateurs logiques disponibles
export enum LogicOperatorEnum {
    EQUALS = 'equals',
    NOT_EQUALS = 'not_equals',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'not_contains',
    GREATER_THAN = 'greater_than',
    LESS_THAN = 'less_than',
    GREATER_THAN_OR_EQUALS = 'greater_than_or_equals',
    LESS_THAN_OR_EQUALS = 'less_than_or_equals',
    IS_EMPTY = 'is_empty',
    IS_NOT_EMPTY = 'is_not_empty',
    STARTS_WITH = 'starts_with',
    ENDS_WITH = 'ends_with'
  }
  
  // Énumération des types d'actions possibles
  export enum LogicActionEnum {
    SHOW = 'show',
    HIDE = 'hide',
    REQUIRE = 'require',
    SKIP_TO = 'skip_to',
    ENABLE = 'enable',
    DISABLE = 'disable',
    SET_VALUE = 'set_value'
  }
  
  // Interface pour une règle de logique conditionnelle
  export interface ConditionalLogicRule {
    id: string;
    questionId: string;
    operator: LogicOperatorEnum;
    value: string | number | string[] | null;
    action: LogicActionEnum;
    targetId?: string; // ID de la question ou section cible (pour SKIP_TO, SHOW, HIDE, etc.)
    targetValue?: string | number; // Valeur à définir (pour SET_VALUE)
  }
  
  // Interface pour un groupe de règles (avec opérateur AND ou OR)
  export interface ConditionalLogicGroup {
    id: string;
    operator: 'AND' | 'OR';
    rules: ConditionalLogicRule[];
  }
  
  // Interface pour toutes les logiques conditionnelles d'une question
  export interface QuestionLogic {
    questionId: string;
    groups: ConditionalLogicGroup[];
  }
  
  // Fonctions utilitaires pour les logiques conditionnelles
  
  /**
   * Vérifie si une condition est remplie en fonction de la réponse utilisateur
   * @param rule Règle de logique conditionnelle
   * @param userResponse Réponse utilisateur à évaluer
   * @returns boolean Vrai si la condition est remplie
   */
  export function evaluateLogicRule(rule: ConditionalLogicRule, userResponse: any): boolean {
    switch (rule.operator) {
      case LogicOperatorEnum.EQUALS:
        return userResponse === rule.value;
      
      case LogicOperatorEnum.NOT_EQUALS:
        return userResponse !== rule.value;
      
      case LogicOperatorEnum.CONTAINS:
        if (Array.isArray(userResponse)) {
          return Array.isArray(rule.value) 
            ? rule.value.some(v => userResponse.includes(v))
            : userResponse.includes(rule.value);
        }
        return typeof userResponse === 'string' && typeof rule.value === 'string'
          ? userResponse.includes(rule.value)
          : false;
      
      case LogicOperatorEnum.NOT_CONTAINS:
        if (Array.isArray(userResponse)) {
          return Array.isArray(rule.value) 
            ? !rule.value.some(v => userResponse.includes(v))
            : !userResponse.includes(rule.value);
        }
        return typeof userResponse === 'string' && typeof rule.value === 'string'
          ? !userResponse.includes(rule.value)
          : true;
      
      case LogicOperatorEnum.GREATER_THAN:
        return typeof userResponse === 'number' && typeof rule.value === 'number'
          ? userResponse > rule.value
          : false;
      
      case LogicOperatorEnum.LESS_THAN:
        return typeof userResponse === 'number' && typeof rule.value === 'number'
          ? userResponse < rule.value
          : false;
      
      case LogicOperatorEnum.GREATER_THAN_OR_EQUALS:
        return typeof userResponse === 'number' && typeof rule.value === 'number'
          ? userResponse >= rule.value
          : false;
      
      case LogicOperatorEnum.LESS_THAN_OR_EQUALS:
        return typeof userResponse === 'number' && typeof rule.value === 'number'
          ? userResponse <= rule.value
          : false;
      
      case LogicOperatorEnum.IS_EMPTY:
        return userResponse === null || userResponse === undefined || userResponse === '' 
          || (Array.isArray(userResponse) && userResponse.length === 0);
      
      case LogicOperatorEnum.IS_NOT_EMPTY:
        return !(userResponse === null || userResponse === undefined || userResponse === '' 
          || (Array.isArray(userResponse) && userResponse.length === 0));
      
      case LogicOperatorEnum.STARTS_WITH:
        return typeof userResponse === 'string' && typeof rule.value === 'string'
          ? userResponse.startsWith(rule.value)
          : false;
      
      case LogicOperatorEnum.ENDS_WITH:
        return typeof userResponse === 'string' && typeof rule.value === 'string'
          ? userResponse.endsWith(rule.value)
          : false;
      
      default:
        return false;
    }
  }
  
  /**
   * Évalue un groupe de règles (AND/OR) en fonction des réponses utilisateur
   * @param group Groupe de règles de logique conditionnelle
   * @param responses Réponses utilisateur à toutes les questions
   * @returns boolean Vrai si le groupe de conditions est rempli
   */
  export function evaluateLogicGroup(group: ConditionalLogicGroup, responses: Record<string, any>): boolean {
    if (group.rules.length === 0) {
      return true;
    }
  
    const results = group.rules.map(rule => 
      evaluateLogicRule(rule, responses[rule.questionId])
    );
  
    return group.operator === 'AND'
      ? results.every(result => result)
      : results.some(result => result);
  }
  
  /**
   * Obtient la liste des questions/sections à afficher/masquer en fonction des règles de logique
   * @param questionLogic Ensemble des règles de logique conditionnelle
   * @param responses Réponses utilisateur à toutes les questions
   * @returns Record<string, boolean> Dictionnaire des IDs de questions avec leur état (true = afficher)
   */
  export function getConditionalVisibility(questionLogic: QuestionLogic[], 
                                        responses: Record<string, any>): Record<string, boolean> {
    const result: Record<string, boolean> = {};
  
    questionLogic.forEach(logic => {
      // Évaluer chaque groupe de règles
      logic.groups.forEach(group => {
        const groupResult = evaluateLogicGroup(group, responses);
        
        // Appliquer les actions pour chaque règle du groupe si le groupe est valide
        if (groupResult) {
          group.rules.forEach(rule => {
            if (rule.targetId && (rule.action === LogicActionEnum.SHOW || rule.action === LogicActionEnum.HIDE)) {
              result[rule.targetId] = rule.action === LogicActionEnum.SHOW;
            }
          });
        }
      });
    });
  
    return result;
  }