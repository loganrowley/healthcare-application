/**
 * This component constitutes three filterable search menus into a single component, making it easier for the
 * data entry component to populate the form.
 */

import { Component, Injectable, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Gene } from './gene-variant-type';
import { GeneSearchService } from './gene-search.service';
import { VariantSearchService } from './variant-search.service';
import { VariantTypeSearchService } from './variant-type-search.service';

@Component({
  selector: 'gene-data-row',
  template: `
    <div id="form">
      <div>
        <filterable-search [formGroupReference]="geneDataFormGroup" [searchService]="this.geneSearchService" [formComponentName]="'gene'" [placeholderString]="'Gene'"></filterable-search>
      </div>
      <div>
        <filterable-search [formGroupReference]="geneDataFormGroup" [searchService]="this.variantSearchService" [formComponentName]="'variant'" [placeholderString]="'Variant'"></filterable-search>
      </div>
      <div>
        <filterable-search [formGroupReference]="geneDataFormGroup" [searchService]="this.variantTypeSearchService" [formComponentName]="'type'" [placeholderString]="'Variant Type'"></filterable-search>
      </div>
    </div>
  `,
  styles: [`   
    #form {
      height: 100px;
    }
    
    #form div {
      float: left;
      margin: 4px;
      width: calc(33.333% - 10px);
    }
  `],
  providers: [GeneSearchService, VariantSearchService, VariantTypeSearchService]
})

@Injectable()
export class GeneDataRowComponent {
  @Input() public geneDataFormGroup: FormGroup;

  constructor (private geneSearchService: GeneSearchService, private variantSearchService: VariantSearchService, private variantTypeSearchService: VariantTypeSearchService) {}
}