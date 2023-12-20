import Model from './Model.js';

export default class Words extends Model {

  static table = "vocabulary.words";
  static primary = ["id"];

}