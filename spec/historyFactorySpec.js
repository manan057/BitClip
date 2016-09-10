describe('Unit: History Factory: ', function () {
  beforeEach(module('bitclip'));

  var $scope, $rootScope, $httpBackend, $location, $window, History, tempStore;

  beforeEach(inject(function($injector) {

    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    History = $injector.get('History');

  /******************************************************************
    Mocks up HelloBlock server when a GET request is made to 
    query transaction history of testNet currentAddress.

    var result is the actual return from request to HelloBlock.

    Reference: https://helloblock.io/docs/ref#addresses-transactions
  ********************************************************************/

    var result = {"pagesTotal":9,"txs":[{"txid":"a1ea871ceade301058790ca23ba2476894261f7bed8fd273fa3888c51c7769ae","version":1,"locktime":0,"vin":[{"txid":"453cf16b1bcc8a379f99a434ef04422a8ab4a9bb608ae204aeab349877cb0ec8","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"483045022100c03e1fdf80a7c62c8f327570cb28ade5605793b2cd02681e125e82411edf8c07022018583822b24005eefdecb72c7a4b6615d6744dedc2bf7c394abd3591a79da17e0121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"3045022100c03e1fdf80a7c62c8f327570cb28ade5605793b2cd02681e125e82411edf8c07022018583822b24005eefdecb72c7a4b6615d6744dedc2bf7c394abd3591a79da17e[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":6900000,"value":0.069,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.06800000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null}],"blockhash":"000000006299e273107aa539f08cbeb7fcd9ea12f8094b5826925d514403f5d0","blockheight":299407,"confirmations":628273,"time":1412824945,"blocktime":1412824945,"valueOut":0.069,"size":226,"valueIn":0.069,"fees":0},{"txid":"453cf16b1bcc8a379f99a434ef04422a8ab4a9bb608ae204aeab349877cb0ec8","version":1,"locktime":0,"vin":[{"txid":"af83ab3b7de3e1232ad35f604c3eb60e2974a049aa3a47e02f3be4dedd664151","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"483045022100d300704f5bfcceca366a0354d0a8d86fd8b9ace9a99576c903c56e97455a6561022057be565fc840fcaf464eee2659d6987cb2f9d7de399027954e02d0766144015a0121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"3045022100d300704f5bfcceca366a0354d0a8d86fd8b9ace9a99576c903c56e97455a6561022057be565fc840fcaf464eee2659d6987cb2f9d7de399027954e02d0766144015a[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7000000,"value":0.07,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.06900000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"a1ea871ceade301058790ca23ba2476894261f7bed8fd273fa3888c51c7769ae","spentIndex":0,"spentHeight":299407}],"blockhash":"000000006299e273107aa539f08cbeb7fcd9ea12f8094b5826925d514403f5d0","blockheight":299407,"confirmations":628273,"time":1412824945,"blocktime":1412824945,"valueOut":0.07,"size":226,"valueIn":0.07,"fees":0},{"txid":"af83ab3b7de3e1232ad35f604c3eb60e2974a049aa3a47e02f3be4dedd664151","version":1,"locktime":0,"vin":[{"txid":"9a6e174f5dda7948f300728557d8ad66be1c5d329e67e099dfa2bd297eb42a02","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"47304402201e8cb1f29e387e832e664d9689167d8d32be04134f90cca8901af188e24d5ad60220720863bd18ba618865a00b47a21570afd56cd41bba904a324e1e17da585015050121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"304402201e8cb1f29e387e832e664d9689167d8d32be04134f90cca8901af188e24d5ad60220720863bd18ba618865a00b47a21570afd56cd41bba904a324e1e17da58501505[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7100000,"value":0.071,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07000000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"453cf16b1bcc8a379f99a434ef04422a8ab4a9bb608ae204aeab349877cb0ec8","spentIndex":0,"spentHeight":299407}],"blockhash":"000000006299e273107aa539f08cbeb7fcd9ea12f8094b5826925d514403f5d0","blockheight":299407,"confirmations":628273,"time":1412824945,"blocktime":1412824945,"valueOut":0.071,"size":225,"valueIn":0.071,"fees":0},{"txid":"9a6e174f5dda7948f300728557d8ad66be1c5d329e67e099dfa2bd297eb42a02","version":1,"locktime":0,"vin":[{"txid":"2ab092336124e34bc6cb8464e09084516f1c6180d9a562c6022c71c490c40acf","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"483045022100b3b19d7c3aa9496681ef12ae3f7e4a8ffa750dec2b5cb0b5546d21b47ebf879b022065edb7d0980fc619c59cf32b58811d001586df3558ce024f729fa90c1d2832b40121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"3045022100b3b19d7c3aa9496681ef12ae3f7e4a8ffa750dec2b5cb0b5546d21b47ebf879b022065edb7d0980fc619c59cf32b58811d001586df3558ce024f729fa90c1d2832b4[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7200000,"value":0.072,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07100000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"af83ab3b7de3e1232ad35f604c3eb60e2974a049aa3a47e02f3be4dedd664151","spentIndex":0,"spentHeight":299407}],"blockhash":"000000006299e273107aa539f08cbeb7fcd9ea12f8094b5826925d514403f5d0","blockheight":299407,"confirmations":628273,"time":1412824945,"blocktime":1412824945,"valueOut":0.072,"size":226,"valueIn":0.072,"fees":0},{"txid":"2ab092336124e34bc6cb8464e09084516f1c6180d9a562c6022c71c490c40acf","version":1,"locktime":0,"vin":[{"txid":"389d604d5df14620c0730f999f387095810cfb82d2544cb634f53216a8b4f97d","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"483045022100e87cad7d760bc7f0d0bdb7af864e85e82baa7e0ad0e6af1cdba89c9287d5f52802204f444d91cb2b1ca29df7e8eb1a24d6f8db1ebc2b92a82a2e39bb8407fb3ee7db0121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"3045022100e87cad7d760bc7f0d0bdb7af864e85e82baa7e0ad0e6af1cdba89c9287d5f52802204f444d91cb2b1ca29df7e8eb1a24d6f8db1ebc2b92a82a2e39bb8407fb3ee7db[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7300000,"value":0.073,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07200000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"9a6e174f5dda7948f300728557d8ad66be1c5d329e67e099dfa2bd297eb42a02","spentIndex":0,"spentHeight":299407}],"blockhash":"000000006299e273107aa539f08cbeb7fcd9ea12f8094b5826925d514403f5d0","blockheight":299407,"confirmations":628273,"time":1412824945,"blocktime":1412824945,"valueOut":0.073,"size":226,"valueIn":0.073,"fees":0},{"txid":"389d604d5df14620c0730f999f387095810cfb82d2544cb634f53216a8b4f97d","version":1,"locktime":0,"vin":[{"txid":"3135c08018e705376f45eae723699cf7905891d41900d0671c7a3852309c26d3","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"473044022015724256a200a65c0947164077dd3220c2bb994dc9ac03340fb31b935c3b3cb7022041712dfc211f01b1b44e02e2decc992d99f6440c9aabc0c1576fffd8dbce60a50121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"3044022015724256a200a65c0947164077dd3220c2bb994dc9ac03340fb31b935c3b3cb7022041712dfc211f01b1b44e02e2decc992d99f6440c9aabc0c1576fffd8dbce60a5[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7400000,"value":0.074,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07300000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"2ab092336124e34bc6cb8464e09084516f1c6180d9a562c6022c71c490c40acf","spentIndex":0,"spentHeight":299407}],"blockhash":"000000006299e273107aa539f08cbeb7fcd9ea12f8094b5826925d514403f5d0","blockheight":299407,"confirmations":628273,"time":1412824945,"blocktime":1412824945,"valueOut":0.074,"size":225,"valueIn":0.074,"fees":0},{"txid":"3135c08018e705376f45eae723699cf7905891d41900d0671c7a3852309c26d3","version":1,"locktime":0,"vin":[{"txid":"c209d1f29b54736f04dccd4532c0dc54a55e395546e52012725f830f6fa5d704","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"4730440220541ae17fc7da462ddd8bf49e8e8cc160501b058db476a5144d350ed8fea03bb40220044d23f4434561c0b73ed57c40d8440f2705a5bb1f47ed07ddb2b23e90ab7f870121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"30440220541ae17fc7da462ddd8bf49e8e8cc160501b058db476a5144d350ed8fea03bb40220044d23f4434561c0b73ed57c40d8440f2705a5bb1f47ed07ddb2b23e90ab7f87[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7500000,"value":0.075,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07400000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"389d604d5df14620c0730f999f387095810cfb82d2544cb634f53216a8b4f97d","spentIndex":0,"spentHeight":299407}],"blockhash":"000000006299e273107aa539f08cbeb7fcd9ea12f8094b5826925d514403f5d0","blockheight":299407,"confirmations":628273,"time":1412824945,"blocktime":1412824945,"valueOut":0.075,"size":225,"valueIn":0.075,"fees":0},{"txid":"c209d1f29b54736f04dccd4532c0dc54a55e395546e52012725f830f6fa5d704","version":1,"locktime":0,"vin":[{"txid":"7b3c2b5cb484fe5a033b2ae25eb1fdc69c286d1d3c5a08eb9c8030382187495c","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"47304402205d281880fea11734e44baf570e600d25cbb936431e0669aa2e3ed35ad5b25ee302201de1c165926cf946ea411fe69d7b5473411b4e47bb069e955b1b6ecbc4d6ccba0121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"304402205d281880fea11734e44baf570e600d25cbb936431e0669aa2e3ed35ad5b25ee302201de1c165926cf946ea411fe69d7b5473411b4e47bb069e955b1b6ecbc4d6ccba[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7600000,"value":0.076,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07500000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"3135c08018e705376f45eae723699cf7905891d41900d0671c7a3852309c26d3","spentIndex":0,"spentHeight":299407}],"blockhash":"00000000b7d724993aec011c46d6d0a77edd90fe765f4be8639a36f4010f1f22","blockheight":299399,"confirmations":628281,"time":1412823663,"blocktime":1412823663,"valueOut":0.076,"size":225,"valueIn":0.076,"fees":0},{"txid":"7b3c2b5cb484fe5a033b2ae25eb1fdc69c286d1d3c5a08eb9c8030382187495c","version":1,"locktime":0,"vin":[{"txid":"bcd4bd5f74cfca551cd3cfaa2a3c9c4213648d63bb581cd8f07293fa0ff60c91","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"4730440220113b09f519dcd6e0cfa856a72be179d48a9c7aea2657f9bd5849e70110f503c102202ae0c2e857b584c33f369c32c3af5bc115fe030e015638f6a9a622527561e2540121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"30440220113b09f519dcd6e0cfa856a72be179d48a9c7aea2657f9bd5849e70110f503c102202ae0c2e857b584c33f369c32c3af5bc115fe030e015638f6a9a622527561e254[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7700000,"value":0.077,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07600000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"c209d1f29b54736f04dccd4532c0dc54a55e395546e52012725f830f6fa5d704","spentIndex":0,"spentHeight":299399}],"blockhash":"00000000b7d724993aec011c46d6d0a77edd90fe765f4be8639a36f4010f1f22","blockheight":299399,"confirmations":628281,"time":1412823663,"blocktime":1412823663,"valueOut":0.077,"size":225,"valueIn":0.077,"fees":0},{"txid":"bcd4bd5f74cfca551cd3cfaa2a3c9c4213648d63bb581cd8f07293fa0ff60c91","version":1,"locktime":0,"vin":[{"txid":"c26f89b150d5af2d3e6088ab77855f856cfb93b88505b6f3aa1a58adfc11210e","vout":1,"sequence":4294967295,"n":0,"scriptSig":{"hex":"483045022100f7852d1b15974c06a7a0256b5ee74c63b9d9d29e8f44265e2e4e990b2f6ff32902202758b7ad9848c9eefd02649de4f2f9b2db14294e09f091b8ef6dea7ea2faa1bf0121038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79","asm":"3045022100f7852d1b15974c06a7a0256b5ee74c63b9d9d29e8f44265e2e4e990b2f6ff32902202758b7ad9848c9eefd02649de4f2f9b2db14294e09f091b8ef6dea7ea2faa1bf[ALL] 038ecc591eff93d4698df8f71c3fa4aa5097737f0a350c7b0c18494930ae2eae79"},"addr":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","valueSat":7800000,"value":0.078,"doubleSpentTxID":null}],"vout":[{"value":"0.00100000","n":0,"scriptPubKey":{"hex":"76a9146409ece4bd0cf22a5e2a780db8ad5625097a91e788ac","asm":"OP_DUP OP_HASH160 6409ece4bd0cf22a5e2a780db8ad5625097a91e7 OP_EQUALVERIFY OP_CHECKSIG","addresses":["mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS"],"type":"pubkeyhash"},"spentTxId":null,"spentIndex":null,"spentHeight":null},{"value":"0.07700000","n":1,"scriptPubKey":{"hex":"76a914226cb2bf4f5db4651892ecb562fdedeb608713bf88ac","asm":"OP_DUP OP_HASH160 226cb2bf4f5db4651892ecb562fdedeb608713bf OP_EQUALVERIFY OP_CHECKSIG","addresses":["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf"],"type":"pubkeyhash"},"spentTxId":"7b3c2b5cb484fe5a033b2ae25eb1fdc69c286d1d3c5a08eb9c8030382187495c","spentIndex":0,"spentHeight":299399}],"blockhash":"00000000b7d724993aec011c46d6d0a77edd90fe765f4be8639a36f4010f1f22","blockheight":299399,"confirmations":628281,"time":1412823663,"blocktime":1412823663,"valueOut":0.078,"size":226,"valueIn":0.078,"fees":0}]};

    $httpBackend.when('GET','https://test-insight.bitpay.com/api/txs/?address=mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf')
    .respond(JSON.stringify(result));

  /******************************************************************
    Mocks up the chrome.storage.local setters 
    and getters.
  *******************************************************************/

    $window.chrome = {
      storage: {
        local:{}
      }
    };

    $window.chrome.storage.local.set = function(obj , callback){
      tempStore = obj;
      callback();
    };

    $window.chrome.storage.local.get = function(propStrOrArray, callback){
      var result = {};                        
      if (typeof propStrOrArray === 'string'){
        result[propStrOrArray] = tempStore[propStrOrArray];
      } else if (Array.isArray(propStrOrArray)){
        propStrOrArray.forEach(function(propName){
          result[propName] = tempStore[propName];
        });
      } else if (propStrOrArray === null) {
        result = tempStore;
      }
      callback(result);
    };

  /****************************************************
    Mocks up state of chrome.storage.local
  *****************************************************/

    tempStore = {
      "isMainNet":false,
      "mainNet":{
        "allAddressesAndKeys":[
          ["1GuxzXBZaFfjpGgGEFVt9NBGF9mParcPX2","KwHTcpKsBWSKbpd2JcaPN7yJLFUXXHoUudfrVXoc46QU4sQo87zU"],
          ["1138fgj4sa1kEMBGBiTBSsQWNnfHWB5aoe","L2Wc7UBsAdyKYFx2S6W29mW73Zn6FMD4JGQYFWrESoUhC1KXc2iC"],
          ["1bgGRDEyufhMBkVX1XA6rtC9cXAEBqbww","KzPpppRYpLfQAJQtb9tvmynpkfMSaDjXEyd5deNT6ALJ4D4j4Ksy"]],
        "currentAddress":"1GuxzXBZaFfjpGgGEFVt9NBGF9mParcPX2",
        "currentPrivateKey":"KwHTcpKsBWSKbpd2JcaPN7yJLFUXXHoUudfrVXoc46QU4sQo87zU"
      },
      "testNet":{
        "allAddressesAndKeys":[
          ["mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf","cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79"],
          ["moJvQo6j1uDPXxntNpfFHXcAjwLvJ72sDV","cRnTroGPQrEDR8sjEiC5fDBwqyPL779R2uH3UpfHP5i7rHskXUJg"],
          ["mivutayae2naDT1NxjYN4LjEHXcUsCM6gr","cP2usaS1DnCR1nQboo7d1bMdJs4idzmPSWgvKKX7hPGPU9Yft1my"]],
        "currentAddress":"mieyV4Y8ba87pZYJKsJRz8qcZP4b2HvWLf",
        "currentPrivateKey":"cRqGMD3MDfkEJit4HTtA3tUDcAtQkmogqrLAnuu4aBaefXCp1J79"
      }
    };
  }));
  
  /*********************************************
                      Tests
  **********************************************/

  it('getUsableTransData should return array with correct direction, transaction amount, timestamp and counter-party address', function ( done ) {
    History.getTransactionHist(tempStore.testNet.currentAddress)
    .then(function(transactionArray){
      var singleTx = transactionArray[0];
      var output = History.getUsableTransData(singleTx, tempStore.testNet.currentAddress);
      var expectedResult = ['outbound', 0.001, 1412824945000, 'mpduks3B8ULftm1hcbEf3jQU7iGae7mEMS'];
      expect(JSON.stringify(output)).to.equal(JSON.stringify(expectedResult));
      done();
    });
    $httpBackend.flush();
    $rootScope.$apply();
  });
});