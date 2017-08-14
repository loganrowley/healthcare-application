import { IFilterableSearchOption } from "../data-entry/filterable-search/filterable-search.component";
import { IMergeable, MergeProperties } from "./data-merging";
import { DrugReference } from "../visualize-results/drugs/drug";

/**
 * The gene reference class includes only the base properties for a given gene; those which are required for merging
 * and such.
 */
export class GeneReference implements IMergeable {
  constructor (_hugoSymbol: string) {
    this.hugoSymbol = _hugoSymbol;
  }
  hugoSymbol: string;
  entrezID: number;

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeable = (other: GeneReference) => {
    if (!this.hugoSymbol || this.hugoSymbol === "") {
      return false;
    }
    return this.hugoSymbol === other.hugoSymbol;
  }
  merge = (other: GeneReference) => {
    this.entrezID = MergeProperties(this.entrezID, other.entrezID);
  }
}

/**
 * The gene class provides a quick and easy way to obtain gene names, various IDs, and so on from a
 * variety of databases.  Eventually this class will be made FHIR compliant to speed up FHIR bundle
 * conversion.
 */
export class Gene {
  static fromReference(reference: GeneReference) {
    const newGene = new Gene(reference.hugoSymbol);
    newGene.entrezID = reference.entrezID;
    return newGene;
  }

  constructor(_hugoSymbol: string) {
    this.hugoSymbol = _hugoSymbol;
  }

  // Class properties
  hugoSymbol: string;
  entrezID: number;
  name: string;
  description: string;
  proteinCoding: string;

  // Merges another gene into this gene (overwriting properties if the property of one is undefined).
  mergeable = (other: Gene) => {
    if (!this.hugoSymbol || this.hugoSymbol === "") {
      return false;
    }
    return this.hugoSymbol === other.hugoSymbol;
  }
  merge = (other: Gene) => {
    this.entrezID = MergeProperties(this.entrezID, other.entrezID);
    this.name = MergeProperties(this.name, other.name);
    this.description = MergeProperties(this.description, other.description);
    this.proteinCoding = MergeProperties(this.proteinCoding, other.proteinCoding);
  }
}

/**
 * The variant reference is better way to get only the basic info required for a given variant.
 */
export class VariantReference implements IFilterableSearchOption, IMergeable {
  constructor(_origin: GeneReference, _variantName: string, _hgvsID: string) {
    this.origin = _origin;
    this.variantName = _variantName;
    this.hgvsID = _hgvsID;
  }
  origin: GeneReference;
  variantName: string;
  hgvsID: string;

  optionName = () => {
    return this.origin.hugoSymbol + " " + this.variantName + " " + this.origin.entrezID + " " + this.hgvsID;
  }

  /**
   * Merging methods
   */
  mergeable = (other: VariantReference) => {
    return this.hgvsID === other.hgvsID && this.origin.mergeable(other.origin);
  }

  // Merges another variant reference into this variant reference (overwriting properties if the property of one is undefined).
  merge = (other: VariantReference) => {
    this.origin.merge(other.origin);
    this.variantName = MergeProperties(this.variantName, other.variantName);
  }
}

/**
 * Gene variants vary in their pathogenicity (danger to their host), and are important to consider
 * alongside the genes which they vary from.
 */
export class Variant {
  static fromReference(reference: VariantReference) {
    return new Variant(Gene.fromReference(reference.origin), reference.variantName, reference.hgvsID);
  }

  constructor(_origin: Gene, _variantName: string, _hgvsID: string) {
    this.origin = _origin;
    this.variantName = _variantName;
    this.hgvsID = _hgvsID;
  }
  origin: Gene;
  variantName: string;
  hgvsID: string;
  score: number = 0;
  description: string;
  somatic: boolean;
  types: string[];
  drugs: DrugReference[];
  diseases: string[];
  chromosome: string;
  start: number;
  end: number;

  optionName = () => {
    return this.origin.hugoSymbol + " " + this.variantName + " " + this.origin.entrezID + " " + this.hgvsID;
  }

  /**
   * Merging methods
   */
  mergeable = (other: Variant) => {
    return this.hgvsID === other.hgvsID && this.origin.mergeable(other.origin);
  }

  // Merges another variant reference into this variant reference (overwriting properties if the property of one is undefined).
  merge = (other: Variant) => {
    this.origin.merge(other.origin);
    this.variantName = MergeProperties(this.variantName, other.variantName);
    this.hgvsID = MergeProperties(this.hgvsID, other.hgvsID);
    this.score = MergeProperties(this.score, other.score);
    this.description = MergeProperties(this.description, other.description);
    this.somatic = MergeProperties(this.somatic, other.somatic);
    this.types = MergeProperties(this.types, other.types);
    this.drugs = MergeProperties(this.drugs, other.drugs);
    this.diseases = MergeProperties(this.drugs, other.drugs);
    this.chromosome = MergeProperties(this.chromosome, other.chromosome);
    this.start = MergeProperties(this.start, other.start);
    this.end = MergeProperties(this.end, other.end);
  }

  getLocation = () => {
    return this.chromosome + ", " + (this.start !== this.end ? "Nucleotides " +  this.start + " to " + this.end : "Nucleotide " + this.start);
  }
}
