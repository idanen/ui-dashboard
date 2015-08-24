(function () {
    'use strict';

    angular.module('tabs').controller('UsefulLinksCtrl', UsefulLinksController);

    function UsefulLinksController() {
        this.links = [
            {
                name: 'Maas Platform API reference',
                href: 'http://myd-vm01227.hpswlabs.adapps.hp.com/api/'
            },
            {
                name: 'IntelliJ Guide document',
                href: 'http://ent142.sharepoint.hp.com/teams/HPSW-MaaS/_layouts/WordViewer.aspx?id=/teams/HPSW-MaaS/DevEnv/DevEnv%20-%20Intellij%20Guide.docx&Source=http%3A%2F%2Fent142%2Esharepoint%2Ehp%2Ecom%2Fteams%2FHPSW-MaaS%2FDevEnv%2FForms%2FAllItems%2Easpx%3FInitialTabId%3DRibbon%252EDocument%26VisibilityContext%3DWSSTabPersistence&DefaultItemOpen=1'
            },
            {
                name: 'MaaS Platform - SPMaaS - HP R&D Wiki',
                href: 'https://rndwiki.corp.hpecorp.net/confluence/display/MaaS/Home'
            },
            {
                name: 'Stash',
                href: 'mydtbld0084g.isr.hp.com:7990/projects'
            },
            {
                name: 'QA Portal',
                href: 'http://myd-vm02435.hpswlabs.adapps.hp.com/env/'
            }
        ];

        this.filter = '';
    }
})();
