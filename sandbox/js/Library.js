var DB = {
    Ability : [],
    Text : [],
    Tags : [],
    Armor : [],
    Character: [],              // Monsters and coop players
    Race:[],
    Challenge:[]
};

(function(){
    // Shortcut for building conditions
    var C = function(type, data, target, inverse){
        if(data === undefined){data = [];}
        if(data.constructor !== Array){data = [data];}
        target = target || Game.Consts.TARG_VICTIM;
        inverse = inverse || false;
        return new Condition({type:type, data:data, target:target, inverse:inverse});
    };
    var CO = Condition;
    C.FEMALE = [C(CO.TAGS, "c_vagina"), C(CO.TAGS, "c_breasts")];
    C.BREASTS = C(CO.TAGS, 'c_breasts');
    C.VAG = C(CO.TAGS, 'c_vagina');
    C.VAGINA = C.VAG;
    C.PENIS = C(CO.TAGS, 'c_penis');
    C.CLOTHED = C(CO.NOT_TAGS, 'nude');
    C.NAKED = C(CO.TAGS, 'nude');

    C.A_NAKED = C(CO.TAGS, 'nude', Game.Consts.TARG_ATTACKER);
    C.A_PENIS = C(CO.TAGS, 'c_penis', Game.Consts.TARG_ATTACKER);
    C.A_VAG = C(CO.TAGS, 'c_vagina', Game.Consts.TARG_ATTACKER);
    

    C.HAS_TOP = C(CO.TAGS, 'a_upper');
	C.HAS_BOTTOM = C(CO.TAGS, 'a_lower');
	C.NO_TOP = C(CO.NOT_TAGS, 'a_upper');
	C.NO_BOTTOM = C(CO.NOT_TAGS, 'a_lower');

	C.A_HAS_TOP = C(CO.TAGS, 'a_upper', Game.Consts.TARG_ATTACKER);
	C.A_HAS_BOTTOM = C(CO.TAGS, 'a_lower', Game.Consts.TARG_ATTACKER);
	C.A_NO_TOP = C(CO.NOT_TAGS, 'a_upper', Game.Consts.TARG_ATTACKER);
	C.A_NO_BOTTOM = C(CO.NOT_TAGS, 'a_lower', Game.Consts.TARG_ATTACKER);
    C.NOT_GRAPPLE = C(CO.NO_GRAPPLE);
	
	

    C.ARMOR_TIGHT = C(CO.TAGS, 'a_tight');
    C.ARMOR_THONG = C(CO.TAGS, 'a_thong');


    var humanoid = C(CO.HUMANOID), 
		a_humanoid = C(CO.HUMANOID, [], Game.Consts.TARG_ATTACKER);


    DB.sort = function(assetType, on){

        var db = DB[assetType];
        // Sort
        db.sort(function(a,b){

            if(a[on] === b[on]){
                return 0;
            }

            return a[on] < b[on] ? -1 : 1;
        });

    };

    DB.ini = function(){
        "use strict";
        // Preset tags

            DB.Tags = [
                // Auto generated
                "nude",

                // These are wiped at the end of each turn
                "recently_attacked",            // Recently been the victim of an attack
                "recently_attacking",           // Used an attack this turn
                "recently_missed",              // Recently been the victim of an attack that missed
                



                // Character status
                "c_breasts",
                "c_penis",
                "c_vagina",

                "c_uncut",      // penis uncut

                
                // Armor
                "a_thong",
                "a_shiny",
                "a_tight",
                "a_loose",
                "a_sling",
                "a_upper",      // Has upperbody
                "a_lower",      // Has lowerbody
                "a_bra",
                "a_loincloth",  // has a flappy front bit
                "a_stockings",
                "a_swimsuit",   // Swimsuit type
                "a_armored",
                "a_wettable",   // See through when wet

                // Species specific
                "s_tail",
                "s_fins",
                "s_skin",
                "s_fur",
                "s_scales",
                "s_tail_short",
				"s_horns",
				"s_horn",
                "s_tentacles",

                "s_demon",

                // Effects
                "fx_cold",              // player is cold
                "fx_mitigation",       // Player is mitigating
                "fx_shackled",          // Currently locked in chains

            ];


        // Armor
            // Not in store
            Armor.insert({id:'loincloth', name:'Tattered Loincloth', description:'A tattered loincloth.', tags:['a_loose', 'a_loincloth', 'a_lower'], in_store:false});
            Armor.insert({id:'plateBikini', name:'Plate Bikini', description:'An adorned plate bra and panties.', tags:['a_tight', 'a_thong', 'a_shiny', 'a_upper', 'a_lower'], in_store:false});
            Armor.insert({id:"sexticuffsShirt", name:"Sexticuffs Gear", description:"It's just a T-Shirt with the Sexticuffs logo, and a thong. All in cotton.", tags:["a_tight", "a_thong",  "a_upper", "a_lower", "a_wettable"], in_store:false});
            Armor.insert({id:"tentacleSuitStandalone", name:"Tentacle Suit", description:"It's a top and bottom made in a hard shell-like material with tentacles on the inside tickling your sensitive spots.", tags:["a_upper", "a_lower", "a_tentacles"], in_store:false});
            
            // Public
            Armor.insert({id:"goldenThong", name:"Golden Thong", cost:25, description:"A shiny gold-colored thong that fits tight over your crotch.", tags:["a_shiny", "a_tight", "a_thong", "a_lower"]});
            Armor.insert({id:"goldenBikini", name:"Golden Bikini", cost:25, description:"A shiny gold-colored thong and bra set.", tags:["a_shiny", "a_tight", "a_thong", "a_upper", "a_lower", "a_bra"]});
            Armor.insert({id:"slingBikini", name:"Sling Bikini", cost:30, description:"A shiny sling bikini.", tags:["a_shiny", "a_tight", "a_thong", "a_sling", "a_upper", "a_lower"]});
            Armor.insert({id:"latexSet", name:"Latex Set", cost:150, description:"An outfit made of tight and shiny black latex. Comes with a top, thong and stockings.", tags:["a_shiny", "a_tight", "a_thong", "a_stockings", "a_upper", "a_lower"]});
            Armor.insert({id:"latexSwimsuit", name:"Latex Swimsuit", cost:95, description:"A shiny tight black latex swimsuit with a thong back.", tags:["a_shiny", "a_tight", "a_thong", "a_upper", "a_lower", "a_swimsuit"]});
            Armor.insert({id:"techSuit", name:"Tech Swimsuit", cost:295, description:"A high tech one-piece with armored breasts and legs.", tags:["a_shiny", "a_tight", "a_upper", "a_lower", "a_swimsuit", "a_armored"]});
            

        //

        // Races
            // Monsters
            Race.insert({id:'imp', name_male : 'imp', playable:false, description : 'A stomach high impish creature with horns and hooves'});
            
            Race.insert({id:'breakerDemon', name_male : 'breaker demon', playable:false, description : 'A big muscular demonic canine.'});
            Race.insert({id:'succubus', name_male : 'succubus', playable:false, description : 'A voluptous lady with horns, wings and hooves.'});
            


            // Playable
            Race.insert({id:'fox',name_male : 'fox', description : 'A vulpine', tags:['s_fur', 's_tail']});
            Race.insert({id:'dragon',name_male : 'dragon', name_female : 'dragoness', description : 'A mythical creature', tags:['s_skin', 's_scales', 's_tail', 's_horns']});
            Race.insert({id:'skunk',name_male : 'skunk', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'lizard',name_male : 'lizard', description : '', tags:['s_skin', 's_scales', 's_tail']});
            Race.insert({id:'lynx',name_male : 'lynx', description : '', tags:['s_fur', 's_tail', 's_tail_short']});
            Race.insert({id:'housecat',name_male : 'cat', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'lion',name_male : 'lion', name_female : 'lioness', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'tiger',name_male : 'tiger', name_female : 'tigress', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'dog',name_male : 'dog', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'wolf',name_male : 'wolf', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'fennec',name_male : 'fennec', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'hyena',name_male : 'hyena', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'unicorn',name_male : 'unicorn', description : '', tags:['s_fur', 's_tail', 's_horn']});
            Race.insert({id:'catgirl',name_male : 'catboy', name_female:'catgirl', description : '', tags:['s_skin', 's_tail']});
            Race.insert({id:'shark',name_male : 'shark', description : '', tags:['s_skin', 's_tail', 's_fins']});
            Race.insert({id:'ferret',name_male : 'ferret', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'panda',name_male : 'panda', description : '', tags:['s_fur', 's_tail', 's_tail_short']});
            Race.insert({id:'red_panda',name_male : 'red panda', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'jackal',name_male : 'jackal', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'rabbit', name_male : 'rabbit', description : '', tags:['s_fur', 's_tail', 's_tail_short']});
            Race.insert({id:'bull', name_male : 'bull', name_female : 'cow', description : '', tags:['s_fur', 's_tail', 's_horns']});
            Race.insert({id:'bear', name_male : 'bear', description : '', tags:['s_fur', 's_tail', 's_tail_short']});
            Race.insert({id:'horse', name_male : 'horse', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'human', name_male : 'human', description : '', tags:['s_skin']});
            Race.insert({id:'raccoon', name_male : 'raccoon', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'cheetah', name_male : 'cheetah', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'rodent', name_male : 'rodent', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'bat', name_male : 'bat', description : '', tags:['s_fur', 's_tail', 's_tail_short']});
            Race.insert({id:'bird', name_male : 'bird', description : '', tags:['s_feathers']});
            Race.insert({id:'otter', name_male : 'otter', description : '', tags:['s_fur', 's_tail']});
            Race.insert({id:'possum', name_male : 'possum', description : '', tags:['s_fur', 's_tail']});
            
            

        //





        // Abilities
            // IDs of default abilities everyone should have
            Ability.DEFAULTS = [
                "__BASE_ATTACK__"
            ];

            Ability.PUNISHMENTS = ['__PUNISHMENT_DOM__', '__PUNISHMENT_SUB__', '__PUNISHMENT_SAD__'];

            // __BASE_ATTACK__
            Ability.insert({
                id : '__BASE_ATTACK__',   // Should be unique
                name : 'Attack',
                description : 'Deals 2 damage to an enemy. Can be used multiple times per turn.',
                manacost : {offensive:2},
                cooldown : 0,
                detrimental : true,
                conditions : [new Condition({type:Condition.ENEMY})],
                icon : "media/effects/punch.svg",
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'attack',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 2]]
                            })
                        ]
                    })
                ]
            });

            // Dummy abilities for punishments
            Ability.insert({
                id : '__PUNISHMENT_DOM__',
                name : 'Punishment dominant',
                allow_dead : true,
                conditions:[new Condition({type:Condition.ENEMY})]
            });

            Ability.insert({
                id : '__PUNISHMENT_SUB__',
                name : 'Punishment dominant',
                allow_dead : true,
                conditions:[new Condition({type:Condition.ENEMY})]
            });

            Ability.insert({
                id : '__PUNISHMENT_SAD__',
                name : 'Punishment dominant',
                allow_dead : true,
                conditions:[new Condition({type:Condition.ENEMY})]
            });
            

            

            

            




            // PC
                // Crush
                Ability.insert({
                    id : 'generic_crush',   // Should be unique
                    name : 'Crush',
                    icon : 'media/effects/gavel.svg',
                    description : 'Deals 4 damage.',
                    manacost : {offensive:3},
                    cooldown:2,
                    detrimental : true,
                    playable:true,
                    conditions : [new Condition({type:Condition.SELF, inverse:true})],
                    ai_tags : ["damage"],
                    effects:[
                        new Effect({
                            id : 'generic_crush',
                            max_stacks : 1,
                            duration : 0,
                            detrimental : true,
                            events : [
                                new EffectData({
                                    triggers: [EffectData.Triggers.apply],
                                    effects:[[EffectData.Types.damage, 4]]
                                })
                            ]
                        })
                    ]
                });


                // Taunt
                Ability.insert({
                    id : 'generic_taunt',   // Should be unique
                    name : 'Taunt',
                    icon : 'media/effects/taunt.svg',
                    description : 'Forces an enemy to attack you and reduces their damage done against you by 50%. Counts as mitigation. Can\'t miss.',
                    manacost : {defensive:2},
                    detrimental : true,
                    playable:true,
                    always_hit : true,
                    ranged : true,
                    conditions : [new Condition({type:Condition.ENEMY})],
                    ai_tags : ["defensive"],
                    effects:[
                        new Effect({
                            id : 'genTaunt',
                            max_stacks : 1,
                            duration : 1,
                            detrimental : true,
                            icon: 'media/effects/taunt.svg',
                            name: 'Taunt',
                            description: 'Taunted by :ATTACKER: and has a 40% miss chance against them.',
                            events : [
                                new EffectData({
                                    triggers: [],
                                    effects:[[EffectData.Types.taunt]]
                                }),
                                new EffectData({
                                    triggers: [],
                                    victim_on_attacker : 1,
                                    effects:[[EffectData.Types.damage_done_multi, 0.5]]
                                }),
                            ]
                        }),
                        new Effect({
                            id : 'tauntMitigation',
                            max_stacks : 1,
                            duration : 1,
                            detrimental : false,
                            applyText : ':ATTACKER: is now mitigating',
                            target : Game.Consts.TARG_ATTACKER,
                            tags : ['fx_mitigation']
                        })
                    ]
                });

                // Counterattack
                Ability.insert({
                    id : 'counterAttack',   // Should be unique
                    name : 'Counter',
                    icon : 'media/effects/shield-reflect.svg',
                    description : 'Deals 4 damage. Only usable after being attacked.',
                    manacost : {defensive:2},
                    detrimental : true,
                    cooldown: 2,
                    playable:true,
                    conditions : [
                        new Condition({type:Condition.ENEMY}), 
                        new Condition({type:Condition.TAGS, data:["recently_attacked"], target : Game.Consts.TARG_ATTACKER}),
                    ],
                    ai_tags : ["defensive"],
                    effects:[
                        new Effect({
                            id : 'counterAttack',
                            max_stacks : 1,
                            duration : 0,
                            detrimental : false,
                            icon: 'media/effects/shield-reflect.svg',
                            name: '',
                            description: '',
                            events : [
                                new EffectData({
                                    triggers: [EffectData.Triggers.apply],
                                    effects:[[EffectData.Types.damage, 4]], 
                                }),
                            ]
                        }),
                        
                    ]
                });
                

                // masochism
                Ability.insert({
                    id : 'defensive_masochism',   // Should be unique
                    name : 'Masochism',
                    icon : 'media/effects/masochism.svg',
                    description : 'Gives you 2 offensive mana when you are attacked this turn.',
                    cooldown : 3,
                    detrimental : false,
                    playable:true,
                    conditions : [new Condition({type:Condition.SELF})],
                    ai_tags : ["defensive", "self"],
                    effects:[
                        new Effect({
                            id : 'masochism',
                            icon : 'media/effects/masochism.svg',
                            description : 'Gains 2 offensive mana type when attacked.',
                            max_stacks : 1,
                            duration : 1,
                            detrimental : false,
                            events : [
                                new EffectData({
                                    triggers: [EffectData.Triggers.attacked],
                                    effects:[[EffectData.Types.manaHeal, {offensive:2}]]
                                })
                            ]
                        }),
                    ]
                });
            

                // Purify
                Ability.insert({
                    id : 'support_purify',   // Should be unique
                    name : 'Purify',
                    icon : 'media/effects/purify.svg',
                    description : 'Clears all detrimental effects from a friendly character, or beneficial effects from an enemy.',
                    manacost : {support:2},
                    cooldown : 1,
                    detrimental : false,
                    playable:true,
                    conditions : [],
                    ai_tags : ["dispel"],
                    ranged : true,
                    effects:[
                        new Effect({
                            id : 'purify',
                            max_stacks : 1,
                            duration : 0,
                            detrimental : false,
                            events : [
                                new EffectData({
                                    triggers: [EffectData.Triggers.apply],
                                    effects:[[EffectData.Types.dispel, false, -1]],
                                    conditions:[C(CO.FRIEND)]
                                }),
                                new EffectData({
                                    triggers: [EffectData.Triggers.apply],
                                    effects:[[EffectData.Types.dispel, true, -1]],
                                    conditions:[C(CO.ENEMY)]
                                })
                            ]
                        }),
                    ]
                });

                // Heal
                Ability.insert({
                    id : 'support_heal',   // Should be unique
                    name : 'Heal',
                    icon : 'media/effects/heal.svg',
                    description : 'Restores 4 HP/Armor.',
                    manacost : {support:3},
                    cooldown : 1,
                    detrimental : false,
                    playable:true,
                    ranged : true,
                    conditions : [],
                    ai_tags : ["heal"],
                    effects:[
                        new Effect({
                            id : 't0HEAL',
                            max_stacks : 1,
                            duration : 0,
                            detrimental : false,
                            events : [
                                new EffectData({
                                    triggers: [EffectData.Triggers.apply],
                                    effects:[[EffectData.Types.heal, 4]]
                                })
                            ]
                        }),
                    ]
                });

                // Corrupt
                Ability.insert({
                    id : 'corrupt',   // Should be unique
                    name : 'Corrupt',
                    icon : 'media/effects/corrupt.svg',
                    description : 'Makes your healing abilities deal damage this turn, and cannot be dodged or resisted.',
                    manacost : {},
                    cooldown : 2,
                    detrimental : false,
                    playable:true,
                    ranged : true,
                    conditions : [C(CO.SELF, [])],
                    ai_tags : ["buff"],
                    effects:[
                        new Effect({
                            id : 'corrupt',
                            max_stacks : 1,
                            duration : 1,
                            detrimental : false,
                            target : Game.Consts.TARG_ATTACKER,
                            icon : 'media/effects/corrupt.svg',
                            description : 'Healing abilities now deal damage.',
                            events : [
                                new EffectData({
                                    triggers: [],
                                    effects:[[EffectData.Types.heal_to_damage]]
                                })
                            ]
                        }),
                    ]
                });

                // Ghost Strike
                Ability.insert({
                    id : 'ghost_strike',   // Should be unique
                    name : 'Ghost Strike',
                    icon : 'media/effects/shining-sword.svg',
                    description : 'Deals 3 damage to an enemy and grants you 20% evasion for 2 turns. Counts as mitigation. Can\'t miss.',
                    manacost : {defensive:1, offensive:2},
                    detrimental : true,
                    playable:true,
                    always_hit : true,
                    ranged : false,
                    cooldown : 2,
                    conditions : [new Condition({type:Condition.ENEMY})],
                    ai_tags : ["damage"],
                    effects:[
                        new Effect({
                            id : 'ghostStrikeDmg',
                            max_stacks : 1,
                            duration : 0,
                            detrimental : true,
                            events : [
                                new EffectData({
                                    triggers: [EffectData.Triggers.apply],
                                    effects:[[EffectData.Types.damage, 3]]
                                }),
                            ]
                        }),
                        new Effect({
                            id : 'ghostStrikeBuff',
                            max_stacks : 1,
                            duration : 2,
                            detrimental : false,
                            applyText : ':ATTACKER: is now mitigating',
                            target : Game.Consts.TARG_ATTACKER,
                            icon : 'media/effects/shining-sword.svg',
                            description: '+20% evasion. Mitigating.',
                            name: 'Ghost Strike',
                            events:[
                                new EffectData({
                                    triggers: [],
                                    effects:[[EffectData.Types.dodge, 20]]
                                }),
                            ],
                            tags : ['fx_mitigation']
                        })
                    ]
                });

                // Prism Beam
                Ability.insert({
                    id : 'prism_strike',   // Should be unique
                    name : 'Prism Beam',
                    icon : 'media/effects/crystal-bars.svg',
                    description : 'Deals 4 damage.',
                    manacost : {offensive:2, defensive:1, support:1},
                    cooldown:1,
                    detrimental : true,
                    playable:true,
                    ranged : true,
                    conditions : [new Condition({type:Condition.SELF, inverse:true})],
                    ai_tags : ["damage"],
                    effects:[
                        new Effect({
                            id : 'prism_strike',
                            max_stacks : 1,
                            duration : 0,
                            detrimental : true,
                            events : [
                                new EffectData({
                                    triggers: [EffectData.Triggers.apply],
                                    effects:[[EffectData.Types.damage, 4]]
                                })
                            ]
                        })
                    ]
                });

            //
        
        //

        // Base abilities per type 
            Ability.BASELINE = {}; 
            let baseline = [
                "generic_crush", "generic_taunt", "support_heal", "support_purify"
            ];
            Ability.BASELINE[Ability.AffinityOffensive] = baseline;
            Ability.BASELINE[Ability.AffinityDefensive] = baseline;
            Ability.BASELINE[Ability.AffinitySupport] = baseline;



        //
        


        // Texts
            DB.generateTexts();
            DB.generateChallenges();
    };









    DB.generateChallenges = function(){


        // Abilities

        // BITE
            Ability.insert({
                id : 'BITE',   // Should be unique
                name : 'Bite',
                description : 'Deals 3 armor damage',
                manacost : {offensive:3},
                detrimental : true,
                conditions : [
                    new Condition({type:Condition.SELF, inverse:true}), // Can't be used on self
                    new Condition({type:Condition.NOT_TAGS, data:["nude"]}),
                ],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'attack',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.armorDamage, 4]]
                            })
                        ]
                    })
                ]
            });

        // VAG_FIXATION
            Ability.insert({
                id : 'VAG_FIXATION',   // Should be unique
                name : 'Fixate Vag',
                description : 'Arouse a naked player with a vagina',
                manacost : {support:4},
                detrimental : true,
                conditions : [
                    new Condition({type:Condition.ENEMY}), 
                    new Condition({type:Condition.TAGS, data:["c_vagina"]}), 
                    new Condition({type:Condition.TAGS, data:["nude"]})
                ],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'VAG_FIXATION',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 6]]
                            })
                        ]
                    })
                ]
            });

        // NONVAG_FIXATION
            Ability.insert({
                id : 'NONVAG_FIXATION',   // Should be unique
                name : 'Fixate Body',
                description : 'Arouse a player without a vagina',
                manacost : {support:4},
                detrimental : true,
                conditions : [
                    new Condition({type:Condition.ENEMY}), 
                    new Condition({type:Condition.NOT_TAGS, data:["c_vagina"]}), 
                    new Condition({type:Condition.TAGS, data:["nude"]})
                ],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'NONVAG_FIXATION',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 6]]
                            })
                        ]
                    })
                ]
            });

        // LOW_BLOW
            Ability.insert({
                id : 'LOW_BLOW',   // Should be unique
                name : 'Low Blow',
                description : 'Deals 4 damage and reduces your target\'s hit chance by 25% for one turn',
                manacost : {offensive:2, defensive:2}, 
                detrimental : true,
                conditions : [new Condition({type:Condition.SELF, inverse:true})],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'LOW_BLOW_dmg',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 4]]
                            })
                        ]
                    }),
                    new Effect({
                        id : 'LOW_BLOW_hit',
                        name : 'Low Blow',
                        description : 'Hit chance reduced by 25%',
                        max_stacks : 1,
                        duration : 1,
                        detrimental : true,
                        icon : 'media/effects/boxing-glove.svg',
                        applyText : ":TNAME:'s focus fell.",
                        events : [
                            new EffectData({
                                triggers: [],
                                effects:[[EffectData.Types.hit, -25]]
                            })
                        ]
                        
                    }),
                ]
            });

		// Succubus kiss
			Ability.insert({
                id : 'KISS',   // Should be unique
                name : 'Kiss',
                description : 'Destroys 3 defensive crystals on an enemy.',
                manacost : {support:2}, 
                detrimental : true,
                conditions : [new Condition({type:Condition.ENEMY}), C(CO.MANA_GREATER_THAN, {defensive:0})],
				cooldown: 3,
                ai_tags : [],
                effects:[
                    new Effect({
                        id : 'kiss',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.manaDamage, {defensive:3}]]
                            })
                        ]
                    })
                ]
            });

		// Succubus Aura
			Ability.insert({
                id : 'SUCCUBUS_AURA',   // Should be unique
                name : 'Succubus Aura',
                description : 'Attackers will be stunned for 2 turns. Caster takes 100% more damage the turn after.',
                manacost : {defensive:2}, 
                detrimental : false,
                conditions : [new Condition({type:Condition.SELF})],
				cooldown: 4,
                ai_tags : [],
                effects:[
                    new Effect({
                        id : 'succubusAura',
                        max_stacks : 1,
                        duration : 1,
                        detrimental : false,
                        
                        icon : 'media/effects/lips.svg',
                        name: 'Stunning Aura',
                        description : 'Stuns anyone who uses a detrimental ability against this target.',

                        events : [
                            new EffectData({
                                triggers: [],
                                effects:[[EffectData.Types.invul]]
                            }),
                            // Trigger frailty after aura fades
                            new EffectData({
                                triggers: [EffectData.Triggers.remove],
                                effects: [
                                    [EffectData.Types.text, ":ATTACKER: looks frail as the aura ends!"],
                                    [EffectData.Types.applyEffect, new Effect({
                                        id : 'succubusFrail',
                                        duration : 1,
                                        detrimental : true,
                                        target: Game.Consts.TARG_ATTACKER,
                                        fadeText : ":TNAME: looks less frail.",
                                        icon : 'media/effects/weaken.svg',
                                        name : 'Frailty',
                                        description : 'Taking 2x damage',
                                        events : [
                                            new EffectData({
                                                triggers: [],
                                                effects: [[EffectData.Types.damage_taken_multi, 2]]
                                            }),
                                        ]
                                    })]
                                ]
                            }),
                            // Trigger stun on attacked
							new EffectData({
                                triggers: [[EffectData.Triggers.attacked]],
                                effects:[
                                    [EffectData.Types.applyEffect, new Effect({
                                        id : 'succubusStun',
                                        duration : 2,
                                        detrimental : true,
                                        target: Game.Consts.TARG_RAISER,
                                        fadeText : ":TNAME: recovers from the succubus charm.",
                                        applyText : ":TNAME: is stunned.",
                                        icon : 'media/effects/stun.svg',
                                        name : 'Succubus Charm',
                                        description : 'Stunned, taking 2x damage',
                                        tags : ["succubus_aura"],
                                        events : [
                                            new EffectData({
                                                triggers: [],
                                                effects: [[EffectData.Types.stun],[EffectData.Types.damage_taken_multi, 2]]
                                            }),
                                            new EffectData({
                                                triggers: [EffectData.Triggers.apply],
                                                effects: [[EffectData.Types.text, ":TARGET: succumbs to the :ARACE:'s aura!", 'mez']]
                                            }),
                                        ]
                                    })],
                                ]
                            }),
                        ]
                    })
                ]
            });

		// Whip crack
			Ability.insert({
                id : 'WHIPCRACK',   // Should be unique
                name : 'Whipcrack',
                description : 'Deals 4 damage and reduces your target\'s hit chance by 10% for two turns',
                manacost : {offensive:4, defensive:2}, 
                cooldown : 3,
                detrimental : true,
                conditions : [new Condition({type:Condition.SELF, inverse:true})],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'WHIPCRACK_dmg',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 4]]
                            })
                        ]
                    }),
                    new Effect({
                        id : 'WHIPCRACK_hit',
                        name : 'Low Blow',
                        description : 'Hit chance reduced by 15%',
                        max_stacks : 1,
                        duration : 2,
                        detrimental : true,
                        icon : 'media/effects/boxing-glove.svg',
                        applyText : ":TNAME:'s focus fell.",
                        events : [
                            new EffectData({
                                triggers: [],
                                effects:[[EffectData.Types.hit, -10]]
                            })
                        ]
                        
                    }),
                ]
            });

            

            
        // GRASP
            Ability.insert({
                id : 'GRASP',   // Should be unique
                name : 'Grasp',
                icon: 'media/effects/grab.svg',
                description : 'Grabs a player in a vice-like grip, inflicting heavy damage and stunning the player for 1 turn unless mitigating.',
                manacost : {support:2},
                cooldown: 3,
                detrimental : true,
                charged : 1,
                conditions : [new Condition({type:Condition.SELF, inverse:true})],
                charge_hit_conditions : [C(CO.NOT_TAGS, ["fx_mitigation"])],
                ai_tags : ["damage", "stun"],
                effects:[
                    new Effect({
                        id : 'GRASP',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 10]]
                            })
                        ]
                    }),
                    new Effect({
                        id : 'GRASP',
                        max_stacks : 1,
                        duration : 1,
                        detrimental : true,
                        fadeText : ":TNAME: recovers from being grasped.",
                        applyText : ":TNAME: is stunned.",
                        icon : 'media/effects/stun.svg',
                        events : [
                            new EffectData({
                                triggers: [],
                                effects:[[EffectData.Types.stun]]
                            })
                        ]
                    }),
                ]
            });

        // HYDROMANCE
            Ability.insert({
                id : 'HYDROMANCE',   // Should be unique
                name : 'Hydromance',
                description : 'Deals 2 damage instantly, and at turn start over 2 turns.',
                manacost : {offensive:4},
                cooldown: 3,
                detrimental : true,
                ranged : true,
                conditions : [new Condition({type:Condition.SELF, inverse:true})],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'HYDROMANCE',
                        name : 'Hydromance',
                        description: 'Taking 2 damage at the start of each turn.',
                        max_stacks : 1,
                        duration : 2,
                        detrimental : true,
                        icon : 'media/effects/hydromance.svg',
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply, EffectData.Triggers.turnStart],
                                effects:[[EffectData.Types.damage, 2]]
                            })
                        ]
                    }),
                ]
            });

        // CHALLENGER_SLAM
            Ability.insert({
                id : 'CHALLENGER_SLAM',   // Should be unique
                name : 'Challenger Slam',
                icon: 'media/effects/gavel.svg',
                description : 'Deals 12 damage. Interrupted by taking damage.',
                manacost : {offensive:2, support:2},
                cooldown: 3,
                detrimental : true,
                charged : 1,
                passives : [
                    new Effect({
                        id : 'challengerSlamInterrupt',
                        max_stacks : 1,
                        duration : Infinity,
                        detrimental : false,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.takeDamage],
                                effects:[[EffectData.Types.interrupt, 'CHALLENGER_SLAM']]
                            })
                        ]
                    })
                ],
                conditions : [new Condition({type:Condition.SELF, inverse:true})],
                ai_tags : ["damage", "stun"],
                effects:[
                    new Effect({
                        id : 'GRASP',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 12]]
                            })
                        ]
                    }),               
                ]
            });

			

		// TENTACLE_PIT_ATTACK
			Ability.insert({
                id : 'TENTACLE_PIT_ATTACK',   // Should be unique
                name : 'Attack',
                description : 'Deals 3 damage.',
                manacost : {offensive:2},
                cooldown: 1,
                detrimental : true,
                charged : 0,
                ranged : true,
                conditions : [new Condition({type:Condition.SELF, inverse:true})],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'TentaclePitAttack',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 3]]
                            })
                        ]
                    }),               
                ]
            });

		// TENTACLE_PIT_SUMMON
			Ability.insert({
                id : 'TENTACLE_PIT_SUMMON',   // Should be unique
                name : 'Summon Tentacle',
                icon: 'media/effects/gavel.svg',
                description : 'Spawns a tentacle on the arena.',
                manacost : {},
                cooldown: 4,
                detrimental : false,
                charged : 0,
                ranged : true,
                conditions : [C(CO.SELF), C(CO.TEAM_PLAYERS_LESS, [4])],
                ai_tags : ["summon"],
                effects:[
                    new Effect({
                        id : 'TentaclePitSummon',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : false,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[
									[EffectData.Types.summonNpc, 'TentaclePitTentacle']
								]
                            })
                        ]
                    }),               
                ]
            });
		
		// TENTACLE_SQUEEZE
			Ability.insert({
                id : 'TENTACLE_SQUEEZE',   // Should be unique
                name : 'Tentacle Squeeze',
				icon : 'media/npc/tentacle.svg',
                description : 'Grasps a non-mitigating player, grappling them and dealing damage.',
                manacost : {defensive:2}, 
				duration: Infinity, 
                cooldown: 4,
                detrimental : true,
                charged : 1,
                ranged : true,
				charge_hit_conditions : [C(CO.NOT_TAGS, ["fx_mitigation"])],
                conditions : [C(CO.NO_GRAPPLE)],
                ai_tags : ["taunt", "grapple"],
                effects:[
                    new Effect({
                        id : 'TentacleSqueeze',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
							new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[
									EffectData.Types.grapple,
									// Deal damage to victim
									[new Effect({
										id : 'tentacleSqueezeGrapple',
										duration:Infinity,
										events:[
											new EffectData({
												triggers : [EffectData.Triggers.turnStart],
												effects : [
													[EffectData.Types.text, ":ATTACKER: squeezes :TARGET:!", 'stretch'],
													[EffectData.Types.damage, 2]
												]
											})
										]
									})],
									// Stun attacker
									[new Effect({
										duration:Infinity,
										events:[
											new EffectData({
												effects : [
													[EffectData.Types.stun]
												]
											})
										]
									})],
								]]
                            }),
                        ]
                    }),
                ]
            });

		// TENTACLE_INJECT
			Ability.insert({
                id : 'TENTACLE_INJECT',   // Should be unique
                name : 'Inject',
                description : 'Squirts tentacle goo into a player.',
                manacost : {offensive:4},
                cooldown: 1,
                detrimental : true,
                charged : 0,
                ranged : true,
                conditions : [C(CO.EFFECT, ['tentacleSqueezeGrapple', 1])],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[
									[EffectData.Types.damage, 6]
								]
                            })
                        ]
                    }),               
                ]
            });
		
        // YOGGOTH_SUIT
            Ability.insert({
                id : 'YOGGOTH_SUIT',   // Should be unique
                name : 'Tentacle Suit',
                description : 'Equips a tentacle suit, shielding against mass impale.',
                icon : 'media/effects/tentacle-heart.svg',
                manacost : {defensive:2},
                cooldown: 1,
                detrimental : false,
                charged : 0,
                conditions : [C(CO.SELF)],
                ai_tags : [],
                effects:[
                    [new Effect({
                        detrimental : true,
                        max_stacks : 5,
                        no_dispel : true,
                        id : 'tentacleSuit',
                        name : 'Tentacle Suit',
                        description : 'Arouses you each turn. Using an ability removes a stack. Undispellable.',
                        icon : 'media/effects/tentacle-heart.svg',
                        duration : Infinity,
                        fadeText : 'The last remnants of :ATTACKER:\'s tentacle suit falls off!',
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.turnStart],
                                effects:[
                                    [EffectData.Types.text, ":ATTACKER:'s tentacle suit tickles across :THIS: genitals!", "wet_squeeze"],
									[EffectData.Types.damage, 1]
								]
                            }),
                            new EffectData({
                                effects:[[EffectData.Types.overrideClothes, new Armor({
                                    id : 'tentacleSuit',
                                    name : 'Tentacle Suit',
                                    description : 'A loosely pieced together suit with little tentacles squirming on the inside. Protects against Yoggoth\'s impalements!',
                                    tags : ['tentacleSuit', 'a_upper', 'a_lower']
                                })]]
                            }),
                            new EffectData({
                                triggers: [EffectData.Triggers.abilityUsed],
                                effects:[
									[EffectData.Types.addStacksTo, '_THIS_', -1]
								]
                            })
                        ]
                    }), 5], // 5 stacks               
                ]
            });

        // YOGGOTH_ULTIMATE
            Ability.insert({
                id : 'YOGGOTH_ULTIMATE',   // Should be unique
                name : 'Yell of the Old',
                description : 'The ground is shaking...',
                icon : 'media/effects/tentacle-heart.svg',
                manacost : {},
                cooldown: 4,
                detrimental : true,
                charged : 1,
                ranged : true,
                // Two rounds have to have passed before you can use this ability
                conditions : [C(CO.TOTAL_TURNS_GREATER, "(vNumPlayers+1)*2")],
                charge_hit_conditions : [C(CO.ENEMY), C(CO.NOT_TAGS, ['tentacleSuit'])],
                charge_text : ':ATTACKER: lets out a terrible yell, causing the ground to start shaking!',
                charge_fail_text : ':TARGET: was shielded from :ATTACKER:\'s assault!',
                aoe : true,
                ai_tags : ["important"],
                effects:[
                    [new Effect({
                        detrimental : true,
                        id : 'yoggothUltimate',
                        duration : 0,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[
									[EffectData.Types.damage, 15]
								]
                            }),
                        ]
                    })],               
                ]
            });

        // YOGGOTH_COMMAND
            Ability.insert({
                id : 'YOGGOTH_COMMAND',   // Should be unique
                name : 'Yoggoth Command',
                description : 'Deals 4 damage to a player wearing a tentacle suit.',
                manacost : {offensive:3},
                cooldown: 1,
                detrimental : true,
                charged : 0,
                ranged : true,
                conditions : [C(CO.SELF, undefined, undefined, true), C(CO.TAGS, ['tentacleSuit'])],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'YoggothCommand',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 4]]
                            })
                        ]
                    }),               
                ]
            });

        // JAILOR_SHACKLE
            Ability.insert({
                id : 'JAILOR_SHACKLE',   // Should be unique
                name : 'Shackle',
                description : 'Shackles a player, limiting them to ranged and self casts.',
                manacost : {defensive:2},
                cooldown: 4,
                detrimental : true,
                charged : 0,
                ranged : true,
                conditions : [C(CO.ENEMY), C(CO.EFFECT, ['JailorShackle'], undefined, true)],
                ai_tags : ["damage"],
                effects:[
                    new Effect({
                        id : 'JailorShackle',
                        max_stacks : 1,
                        duration : 2,
                        detrimental : true,
                        name: 'Shackle',
                        description : 'Melee abilities can only target yourself.',
                        icon : 'media/effects/handcuffs.svg',
                        tags : ['fx_shackled'],
                        events : [
                            new EffectData({
                                triggers: [],
                                effects:[[EffectData.Types.conditionalSilence, [[C(CO.SELF), C(CO.ABILITY_RANGED)]]]]
                            })
                        ]
                    }),

                ]
            });

        // JAILOR_TORTURE
            Ability.insert({
                id : 'JAILOR_TORTURE',   // Should be unique
                name : 'Torture',
                description : 'Tortures a player, increasing their damage taken by subsequent tortures by 50%. Not dispellable.',
                manacost : {},
                cooldown: 1,
                detrimental : true,
                charged : 0,
                ranged : false,
                conditions : [C(CO.ENEMY)],
                ai_tags : ["damage", "important"],
                effects:[
                    new Effect({
                        id : 'JailorTorture',
                        max_stacks : 1,
                        duration : 0,
                        detrimental : true,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[[EffectData.Types.damage, 1]]
                            })
                        ]
                    }),
                    // Apply stacking effect
                    [new Effect({
                        id : 'JailorTorture',
                        max_stacks : 100,
                        duration : Infinity,
                        detrimental : true,
                        no_dispel : true,
                        name : 'Torture',
                        description : 'Subsequent tortures deal more damage',
                        icon : 'media/effects/voodoo-doll.svg',
                        events : [
                            new EffectData({
                                triggers: [],
                                effects:[[EffectData.Types.damage_boost, 'round(1.5^(fxStacks-1))', 'JAILOR_TORTURE']]
                            })
                        ]
                    }), 1],
                ]
            });
        
        // JAILOR_CONFESS
            Ability.insert({
                id : 'JAILOR_CONFESS',   // Should be unique
                name : 'Confess',
                description : 'Confess, removing all stacks of torture.',
                icon : 'media/effects/silenced.svg',
                manacost : {defensive:1, support:1, offensive:1}, 
                cooldown: 1,
                detrimental : false,
                charged : 0,
                conditions : [C(CO.SELF)],
                ai_tags : [],
                effects:[
                    new Effect({
                        detrimental : false,
                        max_stacks : 1,
                        duration : 0,
                        events : [
                            new EffectData({
                                triggers: [EffectData.Triggers.apply],
                                effects:[
									[EffectData.Types.remByID, 'JailorTorture']
								]
                            }),
                        ]
                    }), // 5 stacks               
                ]
            });




        // Base characters here
            // Imp
            Character.insert({"id":"imp", image:'media/npc/imp.svg', name:'Imp', race:Race.get('imp'), description:"", body_tags:["impish"], abilities:[
                //"BITE",
                "LOW_BLOW"
            ], max_armor:5, max_hp:15, social:75, size:3, tags:["c_penis", "s_demon"], armorSet:Armor.get('loincloth')});

            // Hydromancer. Has a custom tag for mc_hydromancer
            Character.insert({"id":"impHydromancer", name:'Imp Hydromancer', race:Race.get('imp'), description:"", body_tags:["impish"], abilities:[
                "LOW_BLOW",
                // Does damage over time
                "HYDROMANCE",
                "BITE"
            ], max_armor:5, max_hp:20, social:60, size:3, tags:["c_penis", "s_demon", "mc_hydromancer"], armorSet:Armor.get('loincloth')});

            Character.insert({"id":"breakerDemon", name:'Breaker Demon', race:Race.get('breakerDemon'), description:"", body_tags:["demonic"], abilities:[
                "LOW_BLOW",
                "GRASP"
            ], max_armor:10, max_hp:40, size:8, strength:9, tags:["c_penis", "s_demon"], armorSet:Armor.get('loincloth')});


            Character.insert({"id":"succubus", name:'Succubus', image:'media/npc/succubus.jpg', race:Race.get('succubus'), description:"A busty succubus with a long whip. Beware before attacking.", body_tags:[], abilities:[
                "KISS",						// Kiss a player, destroying 3 defensive crystals
                "SUCCUBUS_AURA",			// Adds 100% dodge chance for 1 turn and stuns all players that attack her for 2 turns
                "WHIPCRACK"					// Whips a player, inflicting extra damage
            ], max_armor:10, max_hp:20, social:75, size:5, tags:["c_vagina", "c_breasts", "s_demon"], armorSet:Armor.get('plateBikini')});

			Character.insert({"id":"TentaclePitTentacle", name:'Tentacle', image:'media/npc/tentacle.svg', 
				race:new Race({id:'TentaclePitTentacle', name_male : 'Tentacle', playable:false, humanoid:false}), 
				description:"A tentacle has sprung from the ground! Defeating it will harm the tentacle pit!", 
				abilities:[
                	"TENTACLE_PIT_ATTACK",
					"TENTACLE_SQUEEZE"
            	], 
				passives:[
					new Effect({
						id : 'death',
						duration : Infinity,
						depletable : true,
						detrimental : false,
						events : [
							new EffectData({
								// Deals maxHP damage to parent upon death
								triggers : [[EffectData.Triggers.death]],
								effects : [
									[EffectData.Types.text, 'The Tentacle Pit was hurt by defeating the tendril!'],
									[EffectData.Types.applyEffect, new Effect({
										id: '',
										duration : 0,
										detrimental : true,
										target : Game.Consts.TARG_VICTIM_PARENT,
										events:[new EffectData({
											triggers : [EffectData.Triggers.apply], 
											effects: [[EffectData.Types.damage, "aMHP"]]
										})]
									})]
								]
							})
						]
					})
				],
				ignore_default_abils : true,
				max_armor:0, max_hp:15, size:7
			});

			
		// 


        


        // For challenges, monster HP will increase based on nr players

        // Insert custom NPCS
        
        // Succubi
        var suca = Character.get('succubus').clone(),
            sucb = Character.get('succubus').clone()
        ;
        suca.name = 'Xyllia';
        sucb.name = 'Vylnila';


        // Tutorial
        Challenge.insert({
            id : 'tutorial',
            name : 'Welcome to Sexticuffs',
            description : 'A primer for new fighters!',
            buttonbg : '',
            wings : [
                // Only one wing for tutorial
                new ChallengeWing({

                    id : 'tutorial',
                    name : 'Tutorial',
                    description : 'Think you got what it takes to perform in Sexticuffs? Try the crash course!',
                    stages:[

                        // Target Dummy
                        new ChallengeStage({
                            difficulty: ChallengeStage.difficulty.none,
                            id : 'targetDummy',
                            icon : 'media/npc/barrel.svg',
                            name : 'Target Dummy',
                            //music : 'rocket_power',
                            //background : '',
                            description : 'Learn the ropes, fight a target dummy!',
							intro : [
								new ChallengeTalkingHead({icon:'', text:'Instructor: Welcome to the sexticuffs holo-arena!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Instructor: All combat is digitally managed by our computers.', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Instructor: Reduce your opponent\'s hit points by using the provided abilities to win.', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Instructor: Abilities are charged with power gems.', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Instructor: You will gain bonus power each round based on your affinity.', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Instructor: Familiarize yourself with these gems while defeating the target dummy!', sound:''}),
                            ],
                            npcs : [
                                new Character({
                                    "id":"dummy", name:'Target Dummy', 
                                    race:new Race({
                                        id : 'targetDummy',
                                        name_male : 'Target Dummy',
                                        humanoid : false
                                    }), 
                                    image: 'media/npc/barrel.svg',
                                    description:"A target dummy.", 
                                    abilities:[], 
                                    max_armor:0, max_hp:10, size:5, 
                                    ignore_default_abils : true,
                                    passives : [
                                        new Effect({
                                            id : 'alertAt5hp',
                                            duration : Infinity,
                                            depletable : true,
                                            detrimental : false,
                                            events : [
                                                new EffectData({
                                                    triggers : [[EffectData.Triggers.takeDamageAfter]],
                                                    conditions : [C(CO.BP_LESS_THAN, [0.5])],
                                                    effects : [
                                                        [EffectData.Types.talking_head, new ChallengeTalkingHead({icon:'', text:'Instructor: Good job! Half way there!', sound:''})]
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                            ],
                            passives : [
                                new Effect({
                                    id : 'alertAtGameEnd',
                                    duration : Infinity,
                                    detrimental : false,
                                    events : [
                                        new EffectData({
                                            triggers : [[EffectData.Triggers.gameEnded]],
                                            effects : [
                                                [
                                                    EffectData.Types.talking_head, 
                                                    new ChallengeTalkingHead({icon:'', text:'Instructor: Nicely done! The victor decides the punishment!', sound:''}),
                                                    new ChallengeTalkingHead({icon:'', text:'Instructor: Return to the arena when you are ready to fight a trainer!', sound:''}),
                                                ],
                                                [EffectData.Types.removeArenaPassive, '_THIS_']
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),

                        // Trainer
                        new ChallengeStage({
                            difficulty: ChallengeStage.difficulty.easy,
                            id : 'trainer',
                            icon : 'media/npc/dogbot.jpg',
                            name : 'Virtual Trainer',
                            //music : 'rocket_power',
                            //background : '',
                            description : 'Time for a real fight, even if it\'s just against a virtual trainer!',
							intro : [
								new ChallengeTalkingHead({icon:'', text:'Instructor: Next up you will fight our trainer droid!', sound:''}),
                            ],
                            npcs : [
                                new Character({
                                    "id":"droid", name:'Virtual Trainer', 
                                    race:Race.get('dog'), 
                                    image: 'media/npc/dogbot.jpg',
                                    description:"A female AI, used for training.", 
                                    abilities:[], 
                                    armorSet : Armor.get('techSuit'),
                                    tags:["c_vagina", "c_breasts"], 
                                    max_armor:10, max_hp:10, size:5, 
                                    passives : [
                                        new Effect({
                                            id : 'alertAtHalf',
                                            duration : Infinity,
                                            depletable : true,
                                            detrimental : false,
                                            events : [
                                                new EffectData({
                                                    triggers : [[EffectData.Triggers.takeDamageAfter]],
                                                    conditions : [C(CO.BP_LESS_THAN, [0.501])],
                                                    effects : [
                                                        [EffectData.Types.talking_head, new ChallengeTalkingHead({icon:'', text:'Instructor: Nice! You got her clothes off!', sound:''})]
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                            ],
                            passives : [
                                new Effect({
                                    id : 'alertAtGameVictory',
                                    duration : Infinity,
                                    detrimental : false,
                                    events : [
                                        new EffectData({
                                            triggers : [[EffectData.Triggers.gameWon]],
                                            conditions: [C(CO.PC, [])],
                                            effects : [
                                                [
                                                    EffectData.Types.talking_head, 
                                                    new ChallengeTalkingHead({icon:'', text:'Instructor: Nicely done!', sound:''}),
                                                    new ChallengeTalkingHead({icon:'', text:'Instructor: Only one battle left to earn our matching shirt and underwear set!', sound:''}),
                                                ],
                                                [EffectData.Types.removeArenaPassive, '_THIS_']
                                            ],
                                        }),
                                        new EffectData({
                                            triggers : [[EffectData.Triggers.gameLost]],
                                            conditions: [C(CO.PC, [])],
                                            effects : [
                                                [
                                                    EffectData.Types.talking_head, 
                                                    new ChallengeTalkingHead({icon:'', text:'Instructor: No luck this time! Go for a rematch!', sound:''}),
                                                ],
                                                [EffectData.Types.removeArenaPassive, '_THIS_']
                                            ],
                                        }),
                                    ]
                                })
                            ]
                        }),

                        // Challenger
                        new ChallengeStage({
                            difficulty: ChallengeStage.difficulty.easy,
                            id : 'challenger',
                            icon : 'media/npc/muscle-up.svg',
                            name : 'Challenger',
                            //music : 'rocket_power',
                            //background : '',
                            description : 'To win the fabulous official T-shirt and underwear set, you must defeat the other challenger!',
							intro : [
								new ChallengeTalkingHead({icon:'', text:'Instructor: Your final challenge will be to defeat a fellow challenger!', sound:''}),
                                new ChallengeTalkingHead({icon:'media/npc/muscle-up.svg', text:'Challenger: That shirt is mine! You\'re going down, dude!', sound:''}),
                            ],
                            npcs : [
                                new Character({
                                    "id":"challenger", 
                                    name:'Challenger', 
                                    race:Race.get('housecat'), 
                                    image: 'media/npc/muscle-up.svg',
                                    description:"An overconfident feline trying to become a Sexticuffs challenger.", 
                                    abilities:[
                                        "CHALLENGER_SLAM"
                                    ], 
                                    armorSet : Armor.get('goldenThong'),
                                    tags:["c_penis"], 
                                    max_armor:20, max_hp:20, size:5,  social:50,
                                    passives:[
                                        new Effect({
                                            id : 'alertOnChallengerSlam',
                                            duration : Infinity,
                                            depletable : true,
                                            detrimental : false,
                                            events : [
                                                new EffectData({
                                                    triggers : [[EffectData.Triggers.abilityCharged, "CHALLENGER_SLAM"]],
                                                    effects : [
                                                        [
                                                            EffectData.Types.talking_head, 
                                                            new ChallengeTalkingHead({icon:'', text:'Instructor: He\'s charging an attack!', sound:''}),
                                                            new ChallengeTalkingHead({icon:'', text:'Instructor: This one can be interrupted by damaging him!', sound:''}),
                                                            new ChallengeTalkingHead({icon:'media/npc/muscle-up.svg', text:'Challenger: Uncool yo, you\'re supposed to be impartial!', sound:''}),
                                                        ]
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                            ],
                            passives : [
                                new Effect({
                                    id : 'alertAtGameVictory',
                                    duration : Infinity,
                                    detrimental : false,
                                    events : [
                                        new EffectData({
                                            triggers : [[EffectData.Triggers.gameWon]],
                                            conditions: [C(CO.PC, [])],
                                            effects : [
                                                [
                                                    EffectData.Types.talking_head, 
                                                    new ChallengeTalkingHead({icon:'media/npc/muscle-up.svg', text:'Challenger: So uhh, we\'re still cool right?', sound:''}),
                                                    new ChallengeTalkingHead({icon:'', text:'Instructor: Good job! Return backstage for your reward!', sound:''}),
                                                ],
                                                [EffectData.Types.removeArenaPassive, '_THIS_']
                                            ],
                                        }),
                                        new EffectData({
                                            triggers : [[EffectData.Triggers.gameLost]],
                                            conditions: [C(CO.PC, [])],
                                            effects : [
                                                [
                                                    EffectData.Types.talking_head, 
                                                    new ChallengeTalkingHead({icon:'media/npc/muscle-up.svg', text:'Challenger: Hah, told you this would happen! Now let\'s see what I do to you...', sound:''}),
                                                ],
                                                [EffectData.Types.removeArenaPassive, '_THIS_']
                                            ],
                                        }),
                                    ]
                                })
                            ]
                        }),
                    ],
                    rewards : [
                        new ChallengeReward({
                            type:ChallengeReward.Types.clothes,
                            data: 'sexticuffsShirt',
                        }),
                        new ChallengeReward({
                            type:ChallengeReward.Types.money,
                            data: 50,
                        }),
                    ],
                }),
            ],
            
            conditions : []
        });








        // Hell bent for latex

        Challenge.insert({
            id : 'sexyHell',
            name : 'Hell Bent for Latex',
            description : 'Raid the sexy demonic dimension. Defeat the denizens to receive a reward!',
            buttonbg : 'media/backgrounds/hell.jpg',
            wings : [

				// The gates of hell
                new ChallengeWing({
                    id : 'gatesOfHell',
                    name : 'The Gates of Heck',
                    description : 'You have arrived at the gates of heck, you must defeat the gatekeepers to breach it.',
                    stages : [

                        // One will have a special ability on vaginas, the other will have special abilities on non-vaginas
                        // The trick will be to kill the one not relevant to you
                        new ChallengeStage({
                            id : 'imps',
                            icon : 'media/npc/imp.svg',
                            name : 'Imp Brothers',
                            music : 'rocket_power',
                            background : 'media/backgrounds/hell.jpg',
                            description : 'The two imp brothers have wildy separate interests.',
							intro : [
                                new ChallengeTalkingHead({icon:'', text:'Announcer: Welcome to another fabulous Sexticuffs Match!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Announcer: Today, our challengers will take part in the very challenge of Heck!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Announcer: To get into the evil one\'s castle, they must first breach the gates!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Announcer: Two imps block their path...', sound:''}),
								new ChallengeTalkingHead({icon:'media/npc/imp.svg', text:'Impo: Let\'s get ready to pound some pussy!', sound:''}),
                                new ChallengeTalkingHead({icon:'media/npc/imp.svg', text:'Impicus: Ew no, not not when they have so many other nice things to play with!', sound:''}),
							],
                            npcs : [
                                // Wants vagina
                                new Character({
                                    "id":"impo", name:'Impo', race:Race.get('imp'), description:"Really likes vaginas", body_tags:["impish"], abilities:["BITE","VAG_FIXATION"], max_armor:5, max_hp:10, social:75, size:3, tags:["c_penis", "s_demon"], armorSet:Armor.get('loincloth')
                                }),
                                // Does not want
                                new Character({
                                    "id":"impicus", name:'Impicus', race:Race.get('imp'), description:"Does not like vaginas", body_tags:["impish"], abilities:["BITE","NONVAG_FIXATION"], max_armor:5, max_hp:10, social:75, size:3, tags:["c_penis", "s_demon"], armorSet:Armor.get('loincloth')
                                }),
                            ]
                        }),


                        // Stage 2 - Gatekeeper. Charged attack
                        new ChallengeStage({
                            id : 'gatekeeper',
                            icon : '',
                            name : 'The Gatekeeper',
                            description : 'The gatekeeper blocks the path, keep your defenses up!',
                            music : 'rocket_power',
                            background : 'media/backgrounds/hell.jpg',
							intro : [
                                new ChallengeTalkingHead({icon:'', text:'Announcer: Making their way towards the gates, the adventurers find their path blocked by a brutish demon!', sound:''}),
								new ChallengeTalkingHead({icon:'', text:'Must... smash...', sound:'', left:true})
							],
                            npcs : [
                                new Character({"id":"gatekeeper", name:'The Gatekeeper', race:Race.get('breakerDemon'), description:"A cruel gatekeeper stands in your way.", body_tags:["demonic"], abilities:[
                                    "LOW_BLOW",			// Lowers offenses
                                    "GRASP"				// Charged, stuns and damages unless mitigated
                                ], max_armor:10, max_hp:40, social:75, size:3, tags:["c_penis", "s_demon"], armorSet:Armor.get('loincloth')}),
                            ]
                        }),


                        // Stage 3 - Succubus
                        new ChallengeStage({
                            id : 'succubi',
                            icon : 'media/npc/succubus.jpg',
                            name : 'The Succubi',
                            description : 'Two succubi stand in your way, think before you attack.',
                            music : 'rocket_power',
                            background : 'media/backgrounds/hell.jpg',
							intro : [
                                new ChallengeTalkingHead({icon:'', text:'Announcer: The adventurers have reached the gate!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Announcer: However, the gate is being guarded by two female demons...', sound:''}),
								new ChallengeTalkingHead({icon:'media/npc/succubus.jpg', text:'Xyllia: Oh my, what have we here?', sound:'', left:true}),
                                new ChallengeTalkingHead({icon:'media/npc/succubus.jpg', text:'Vylnila: A new plaything for us!', sound:'', left:true}),
							],
                            npcs : [
								suca, sucb
                            ]
                        }),
                    ],
                    rewards : [
                        new ChallengeReward({
                            type:ChallengeReward.Types.clothes,
                            data:'plateBikini',
                        }),
                        new ChallengeReward({
                            type:ChallengeReward.Types.money,
                            data:100,
                        }),
                    ],
                }),

				// The pit of despair
				new ChallengeWing({
                    id : 'pitOfDespair',
                    name : 'The Pit of Despair',
                    description : 'You have been trapped within the pit of despair! You must escape to the upper levels!',
                    stages : [

                        // 1. The Pit
                        new ChallengeStage({
                            id : 'thePit',
                            icon : 'media/npc/tentaclepit.jpg',
                            name : 'The Pit',
                            music : 'rocket_power',
                            background : 'media/backgrounds/tentacle_pit.jpg',
                            description : 'You have breached the gates of hell, when suddenly the floor gives way!',
							intro : [
								new ChallengeTalkingHead({icon:'', text:'Announcer: The brave adventurers have breached the gates of hell, when suddenly the floor gives way!', sound:''}),
								new ChallengeTalkingHead({icon:'', text:'Announcer: Falling down the chute, they end up within the pit of despair!', sound:''}),
								new ChallengeTalkingHead({icon:'', text:'Announcer: As they get to their bearings, the floor starts wiggling...', sound:''}),
							],
                            npcs : [
                                // Wants vagina
                                new Character({
                                    "id":"tentaclePit", ignore_default_abils : true, name:'The Tentacle Pit', race:new Race({id:'tentaclePit', name_male : 'Tentacle Pit', playable:false, description : 'The chamber you\'re standing in is alive.', humanoid:false}), 
									description:"The chamber itself is alive with tentacles", body_tags:["slimy"], 
									image : 'media/npc/tentaclepit.jpg',
									max_armor:0, max_hp:60, size:10, tags:[], 
									abilities:["TENTACLE_PIT_SUMMON", "TENTACLE_INJECT"],
                                }),
                            ]
                        }),

                        
                        // 2. Yoggoth The Corrupted
                        new ChallengeStage({
                            id : 'yoggoth',
                            icon : 'media/npc/tentaclepit.jpg',
                            name : 'Yoggoth The Corrupted',
                            music : 'rocket_power',
                            background : 'media/backgrounds/tentacle_pit.jpg',
                            description : 'Past the tentacle pit sits Yoggoth The Corruptor. A ghastly tentacle man who fabricate special prisoner suits made of tentacles.',
							intro : [
                                new ChallengeTalkingHead({icon:'', text:'Announcer: A tentacle beast of a man blocks the path!', sound:''}),
								new ChallengeTalkingHead({icon:'', text:'Announcer: Small shells with wriggling tendrils on one side clutter the arena!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Announcer: Only the clever will be victorious!', sound:''}),
							],
                            npcs : [
                                // Mechanics: Players gain an ability that equips a tentacle suit with infinite time and 5 stacks. On turn start, the player takes 2 damage. When they use an ability, the suit loses 1 stack.
                                // After 3 rounds, Yoggoth can cast YOGGOTH_ULTIMATE, which has 1 charge turn and deals heavy damage to all players not wearing a suit.
                                // YOGGOTH_GRASP does moderate damage to a suited player and can be used at any time.
                                // Tactics: Save mana for when you have to equip the suit. Equip suit on ultimate cast. Burn off suit after cast ends. Use cheap abilities if possible.
                                new Character({
                                    "id":"yoggoth", name:'Yoggoth The Corrupted', race:new Race({id:'yoggoth', name_male : 'Tentacle Shambler', tags:['s_tentacles'], playable:false, humanoid:false}), 
									description:"Yoggoth is a tentacle man. His arms are wriggling tentacles, and where his face would go are only more slimy tentacles. He has a large tentacle penis.", body_tags:["slimy"], 
									image : '',
                                    armorSet : Armor.get('loincloth'),
                                    //ignore_default_abils : true,
									max_armor:30, max_hp:30, size:8, tags:[], 
									abilities:[
                                        "YOGGOTH_ULTIMATE",     // Causes large damage to all players without tentacle suit
                                        "YOGGOTH_COMMAND",        // Causes moderate damage to all players with tentacle suit
                                    ],
                                }),
                            ],
                            passives : [
                                new Effect({
                                    id : 'suitAbility',
                                    duration : Infinity,
                                    detrimental : false,
                                    events : [
                                        new EffectData({
                                            conditions : [C(CO.TEAM, [Character.TEAM_PC])],
                                            effects : [
                                                [EffectData.Types.addAbility, Ability.get('YOGGOTH_SUIT')]
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),


                        
                        // 3. The Jailor
                        new ChallengeStage({
                            id : 'theJailor',
                            icon : 'media/backgrounds/dungeon.jpg',
                            name : 'The Jailor',
                            music : 'rocket_power',
                            background : 'media/backgrounds/dungeon.jpg',
                            description : 'The Jailor\'s charge is to keep prisoners from escaping and extract information using various... methods.',
							intro : [
								new ChallengeTalkingHead({icon:'', text:'Announcer: The adventurer finds the dungeon exit!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Announcer: As they near the door, a gate slams behind them!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'Announcer: An ominous laugh is heard from behind!', sound:''}),
                                new ChallengeTalkingHead({icon:'', text:'The Jailor: I will pry the secrets from your bodies!', sound:''}),
							],
                            npcs : [
                                // Mechanics:
                                // Jailor shackles a player for 2 turns, while shackled, players can only use ranged and self cast abilities.
                                // Jailor will torture players, dealing 1 damage and adds a stack of torment, increasing damage done by subsequent torments by 1
                                // Players gain a confess ability which costs 5 support gems and clears torture stacks, also stuns the caster for 2 turns.
                                // Tactics: Use confess if damage gets too high. Use ranged abilities.
                                new Character({
                                    "id":"TheJailor", name:'The Jailor', race:Race.get('jackal'), 
                                    tags:["c_penis", "s_demon"],
									description:"The Jailor is a large ragged jackal with horns and glowing red eyes. Carrying chains and a painful looking tool belt.", body_tags:["fuzzy", "ragged"], 
									image : '',
									max_armor:25, max_hp:25, size:7,
									abilities:[
                                        "JAILOR_SHACKLE",       // Generates a shackle effect for 3 turns. While shackled, the player can only use ranged and self cast abilities.
                                        "JAILOR_TORTURE",       // Deals 1 damage and adds 1 stack of torment, increasing subsequent tortures damage by 1 per stack.
                                    ],
                                }),
                            ],
                            passives: [
                                new Effect({
                                    id : 'jailorConfess',
                                    duration : Infinity,
                                    detrimental : false,
                                    events : [
                                        new EffectData({
                                            conditions : [C(CO.TEAM, [Character.TEAM_PC])],
                                            effects : [
                                                [EffectData.Types.addAbility, Ability.get('JAILOR_CONFESS')]
                                            ]
                                        })
                                    ]
                                })
                            ] 
                        }),
                        

                    ],
                    rewards : [
                        
                        new ChallengeReward({
                            type:ChallengeReward.Types.clothes,
                            data:'tentacleSuitStandalone',
                        }),
                        new ChallengeReward({
                            type:ChallengeReward.Types.money,
                            data:100,
                        }),
                        
                    ],
                }),

                
                // Castle Heck
                /*
				new ChallengeWing({
                    id : 'castleHeck',
                    name : 'Castle Heck',
                    description : 'You have escaped to the upper levels! Defeat Satinan\'s most trusted to reach the king\'s chamber!',
                    stages : [

                        // 1. The Pit
                        new ChallengeStage({
                            id : '?',
                            icon : '?',
                            name : '?',
                            music : '?',
                            background : '?',
                            description : '?',
							intro : [
								// new ChallengeTalkingHead({icon:'', text:'Announcer: The brave adventurers have breached the gates of hell, when suddenly the floor gives way!', sound:''}),
							],
                            npcs : [
                                // Wants vagina
                                /*
                                new Character({
                                    "id":"tentaclePit", ignore_default_abils : true, name:'The Tentacle Pit', race:new Race({id:'tentaclePit', name_male : 'Tentacle Pit', playable:false, description : 'The chamber you\'re standing in is alive.', humanoid:false}), 
									description:"The chamber itself is alive with tentacles", body_tags:["slimy"], 
									image : 'media/npc/tentaclepit.jpg',
									max_armor:0, max_hp:60, size:10, tags:[], 
									abilities:["TENTACLE_PIT_SUMMON", "TENTACLE_INJECT"],
                                }),
                                *//*
                            ]
                        }),

                        

                    ],
                    rewards : [
                        /*
                        new ChallengeReward({
                            type:ChallengeReward.Types.clothes,
                            data:'tentacleSuitStandalone',
                        }),
                        new ChallengeReward({
                            type:ChallengeReward.Types.money,
                            data:100,
                        }),
                        *//*
                    ],
                }),
				*/
                
            ],
            // Not yet supported
            conditions : [],
        });
        
    };





    DB.generateTexts = function(){

        C.A_TENTACLES = C(CO.TAGS, ["s_tentacles"], Game.Consts.TARG_ATTACKER);
        
        var ait = Text.AIT;
        

        // Base attack
            // Ability condition
            var abil = C(CO.ABILITY, ["__BASE_ATTACK__"]);
            Text.insert({conditions:[abil], sound:'punch', ait:[ait.tPunch], text:":ANAME: throws a punch at :TNAME:!"});
            Text.insert({conditions:[abil, humanoid], sound:'slap', ait:[ait.aButt, ait.tSlap], text:":ANAME: smacks :TNAME:'s :BUTT:!"});
            Text.insert({conditions:[abil, humanoid, C.BREASTS, C(CO.TAGS, "a_sling")], sound:'stretch_snap', ait:[ait.aBreasts, ait.tTwang], text:":ANAME: tugs at the front of :TNAME:'s :TCLOTHES:, tugging the straps backwards and releasing them, causing them to snap against the :TRACE:'s :TBREASTS:!"});
            Text.insert({conditions:[abil, humanoid, C(CO.TAGS, "a_sling")], sound:'stretch_snap', ait:[ait.aGroin, ait.tTwang], text:":ANAME: grabs a hold of the bottom of :TNAME:'s :TCLOTHES:, stretching it down between the :TRACE:'s legs before letting it go, snapping up against the :TRACE:'s :TGROIN:!"});
            Text.insert({conditions:[abil, humanoid, C.ARMOR_TIGHT, C.HAS_BOTTOM], sound:'tickle', ait:[ait.aGroin, ait.tTickle], text:":ANAME: tickles at the :TGROIN: of :TARGET:'s tight :TCLOTHES:!"});
            Text.insert({conditions:[abil, humanoid, C.A_PENIS, C.NO_BOTTOM, C.A_NO_BOTTOM], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: manages to get behind :TARGET: and quickly slips :AHIS: :APENIS: up the :TRACE:'s :BUTT:, landing a few thrusts!"});
            Text.insert({conditions:[abil, humanoid, C.A_PENIS, C.NO_BOTTOM, C(CO.TAGS, "a_thong"), C.A_NO_BOTTOM], ait:[ait.aButt, ait.tPin], sound:'squish', text:":ANAME: manages to get behind :TARGET:, quickly slipping the butt-string of the :TRACE:'s :TCLOTHES: aside and shoving :AHIS: :APENIS: up the :TRACE:'s :BUTT:, landing a few thrusts!"});
            Text.insert({conditions:[abil, humanoid, C.A_PENIS, C.NO_BOTTOM, C.NO_BOTTOM, C.VAG, C.A_NO_BOTTOM], ait:[ait.aVag, ait.tPin], sound:'squish', text:":ANAME: manages to get behind :TARGET: and quickly slips :AHIS: :APENIS: up into the :TRACE:'s :TVAGINA:, landing a few thrusts!"});
            Text.insert({conditions:[abil, humanoid, C.ARMOR_THONG], sound:'tickle', ait:[ait.aButt, ait.tTickle], text:":ANAME: slips a finger between :TARGET:'s buttcheeks, pushing it against the string and giving the :TRACE:'s :BUTT: a few tickles!"});
            Text.insert({conditions:[abil, humanoid, C.VAG, C(CO.TAGS, ['c_nude', 'a_tight'])], sound:'tickle', ait:[ait.aGroin, ait.tTickle], text:":ANAME: slips a finger between :TARGET:'s legs, pushing it against :THIS: :TGROIN: and giving the :TRACE: a few tickles!"});
            
            Text.insert({conditions:[abil, humanoid, C.BREASTS, C.HAS_TOP, C(CO.TAGS, ['a_upper'])], sound:'stretch', ait:[ait.aBreasts, ait.tExpose], text:":ANAME: grabs a hold of the top of :TARGET:'s :TCLOTHES:, tugging it out of the way and exposing :TARGET:'s :TBREASTS:!"});
            Text.insert({conditions:[abil, humanoid, C.BREASTS, C.HAS_TOP, C(CO.TAGS, ['a_upper'])], sound:'stretch', ait:[ait.aBreasts, ait.aCloth], text:":ANAME: grabs a hold of the top of :TARGET:'s :TCLOTHES:, tugging :THIS: body fowards and damaging the outfit!"});
            

            Text.insert({conditions:[abil, humanoid, C.ARMOR_TIGHT, C.PENIS, C.HAS_BOTTOM], ait:[ait.aGroin, ait.tTickle], sound:'tickle', text:":ANAME: slips :AHIS: hand between :TARGET:'s legs from behind, using :AHIS: fingers to tickle at the :TRACE:'s balls through :THIS: tight :TCLOTHES:!"});
            Text.insert({conditions:[abil, humanoid, C.ARMOR_THONG], sound:'scratch', ait:[ait.aButt, ait.tScratch], text:":ANAME: slips a finger between :TARGET:'s buttcheeks, pushing it against the string and scratching the :TRACE:'s :BUTT: through :THIS: butt-string!"});
            Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM], sound:'scratch', ait:[ait.aButt, ait.tScratch], text:":ANAME: slips a finger between :TARGET:'s buttcheeks, giving the :TRACE:'s :BUTT: a couple of firm scratches!"});

            Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM, C.VAG], sound:'scratch', ait:[ait.aGroin, ait.tScratch], text:":ANAME: slips :AHIS: fingers between :TARGET:'s legs, giving the :TRACE:'s :TCROTCH: a couple of firm scratches!"});
            Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM, C(CO.TAGS, ['c_uncut'])], sound:'squish', ait:[ait.aGroin, ait.aForeskin, ait.tSqueeze], text:":ANAME: slips :ahis: hand inside :TARGET:'s :TCLOTHES:, grabbing a firm hold of the :TRACE:'s :TPENIS:! :ATTACKER: tugs back :TARGET:'s foreskin and starts pulling up and down, grinding the sensitive tip of :TARGET:'s :TPENIS: across the insides of :THIS: :TCLOTHES:!"});
            Text.insert({conditions:[abil, humanoid, C.A_PENIS, C.A_NO_BOTTOM, C.NO_BOTTOM], v_turntags:['humped_butt', 'knockdown_back'], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: manages to grab :TARGET:'s ankles, tripping :THIM: backwards! While the :TRACE: is dazed, :ATTACKER: separates :THIS: legs and jabs :AHIS: :APENIS: into :TARGET:'s :TBUTT:, rapidly forcing it in and out of the struggling :TRACE:."});
            Text.insert({conditions:[abil, humanoid, C.A_PENIS, C.A_NO_BOTTOM, C.NO_BOTTOM, C.VAG], v_turntags:['humped_pussy', 'knockdown_back'], sound:'squish', ait:[ait.aVag, ait.tPin], text:":ANAME: manages to grab :TARGET:'s ankles, tripping :THIM: backwards! While the :TRACE: is dazed, :ATTACKER: separates :THIS: legs and jabs :AHIS: :APENIS: into :TARGET:'s :TVAG:, rapidly forcing it in and out of the struggling :TRACE:!"});
            Text.insert({conditions:[abil, humanoid, C.A_PENIS, C.A_NO_BOTTOM, C(CO.TAGS, ['humped_pussy', 'humped_butt']), C(CO.TAGS, ['knockdown_back'])], sound:'squish', ait:[ait.aMouth, ait.tPin], text:":ANAME: jumps on the already knocked down :TRACE:, forcing :AHIS: :APENIS: inside :TARGET:'s mouth!"});

            Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.VAG], sound:'squish', ait:[ait.aVag, ait.tRub], text:":ANAME: slips :AHIS: hand between :TARGET:'s legs and pushes :AHIS: fingers against :TARGET:'s clit, rubbing it firmly!"});
            Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM, C.VAG], sound:'squish', ait:[ait.aVag, ait.tRub], text:":ANAME: slips :AHIS: hand between :TARGET:'s legs and into :THIS: :TCLOTHES:, pushing :AHIS: fingers against :TARGET:'s clit. :ANAME: manages to rub it firmly for a little while!"});
            
			Text.insert({conditions:[abil, humanoid, C.A_NO_BOTTOM, C.A_PENIS, C(CO.TAGS, ["s_horns"])], sound:'squish', ait:[ait.aMouth, ait.tPin], text:":ANAME: grabs a hold of :TARGET:'s horns and forces :THIS: head towards :AHIS: :AGROIN:, thrusting :AHIS: :APENIS: into the :TRACE:'s mouth, humping :THIS: face!"});
            Text.insert({conditions:[abil, humanoid, C.A_NO_BOTTOM, C.A_VAG, C(CO.TAGS, ["s_horns"])], sound:'squish', ait:[ait.aMouth], text:":ANAME: grabs a hold of :TARGET:'s horns and forces :THIS: head towards :AHIS: :AGROIN:, grinding it across the :TRACE:'s face!"});
            

            // Succubus aura
            var race_succubus = C(CO.RACE, 'succubus', Game.Consts.TARG_ATTACKER);
            var sucAura = C(CO.TAGS, ['succubus_aura']);
            Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.VAG, sucAura], sound:'squish', ait:[ait.aVag, ait.tRub], text:":ANAME: commands the mesmerized :TRACE: to reach inbetween :THIS: own legs, rubbing :THIS: :TVAG:!"});
            Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.PENIS, sucAura], sound:'squish', ait:[ait.aVag, ait.tRub], text:":ANAME: commands the mesmerized :TRACE: to reach inbetween :THIS: own legs, stroking :THIS: :TPENIS:!"});
            
            // s_tentacles
            Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM, C.A_TENTACLES], sound:'tickle', ait:[ait.aGroin, ait.tTickle], text:":ANAME: slips a tentacle between :TARGET:'s legs, tickling at the :TGROIN: of :TARGET:'s tight :TCLOTHES:!"});
            Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_TENTACLES, C.VAG], sound:'squish', ait:[ait.aGroin, ait.tPin], text:":ANAME: slips a tentacle between :TARGET:'s legs, forcing it up into :TARGET:'s :TVAG: where it starts wiggling around!"});
            Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_TENTACLES], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: slips a tentacle between :TARGET:'s legs, forcing it up into :TARGET:'s :TBUTT: where it starts wiggling around!"});
            Text.insert({conditions:[abil, humanoid, C.ARMOR_THONG, C.A_TENTACLES], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: slips a tentacle behind :TARGET:, pushing it past :THIS: thong string, the :ARACE: pushes the tendril up into :TARGET:'s :TBUTT: where it starts wiggling around!"});
            Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM, C.ARMOR_TIGHT, C.A_TENTACLES, C.PENIS], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze], text:":ANAME: manages to encircle :TARGET:'s package with a tentacle, squeezing achingly at the bulge of :THIS: :TCLOTHES:!"});
            Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_TENTACLES, C.PENIS], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze], text:":ANAME: manages to encircle :TARGET:'s package with a tentacle, squeezing :THIS: package achingly!"});
            Text.insert({conditions:[abil, humanoid, C.A_TENTACLES], sound:'slime_squish_bright', ait:[ait.aMouth, ait.tPin], text:":ANAME: forces a tentacle into :TARGET:'s mouth, allowing it to flail around as it rubs tentacle goo across the :TRACE:'s cheeks!"});
            Text.insert({conditions:[abil, humanoid, C.A_TENTACLES], sound:'slime_whip', ait:[ait.aButt, ait.tSlap], text:"With a wet splash, :ANAME: slaps :TARGET:'s :TBUTT: with a long tentacle!"});
            Text.insert({conditions:[abil, humanoid, C.A_TENTACLES, C.HAS_BOTTOM, C.ARMOR_TIGHT, C.PENIS], sound:'slime_whip', ait:[ait.aGroin, ait.tSlap], text:":ANAME: slaps at the groin of :TARGET:'s :TCLOTHES: with a long tentacle, landing a wet splash across :THIS: bulge!"});
            Text.insert({conditions:[abil, humanoid, C.A_TENTACLES, C.NO_BOTTOM, C.PENIS], sound:'slime_whip', ait:[ait.aGroin, ait.tSlap], text:":ANAME: slaps at :TARGET:'s :TGROIN: with a long tentacle, landing a wet splash across :THIS: exposed :TPENIS:!"});
            

            // in shackles
            let shackled = C(CO.TAGS, 'fx_shackled');
            Text.insert({conditions:[abil, humanoid, shackled, C.A_PENIS, C.A_NO_BOTTOM, C.ARMOR_THONG], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: gets behind the shackled :TRACE:, quickly slipping :TARGET:'s butt-string aside and shoving :AHIS: :APENIS: up :TARGET:'s :TBUTT:, humping it firmly!"});
            Text.insert({conditions:[abil, humanoid, shackled, C.A_PENIS, C.A_NO_BOTTOM, C.ARMOR_THONG, C.VAG], sound:'squish', ait:[ait.aVag, ait.tPin], text:":ANAME: gets behind the shackled :TRACE:, quickly slipping the crotch-cover of :TARGET:'s :TCLOTHES: aside and shoving :AHIS: :APENIS: up :TARGET:'s :TVAG:, humping it firmly!"});
            Text.insert({conditions:[abil, humanoid, shackled, C.A_PENIS, C.A_NO_BOTTOM, C.NO_BOTTOM], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: gets behind the shackled :TRACE: and shoves :AHIS: :APENIS: up :TARGET:'s :TBUTT:, humping it firmly!"});
            Text.insert({conditions:[abil, humanoid, shackled, C.A_PENIS, C.A_NO_BOTTOM, C.NO_BOTTOM, C.VAG], sound:'squish', ait:[ait.aVag, ait.tPin], text:":ANAME: gets behind the shackled :TRACE: and shoves :AHIS: :APENIS: up :TARGET:'s :TVAG:, humping it firmly!"});
            Text.insert({conditions:[abil, humanoid, shackled, C.HAS_BOTTOM, C.VAG], sound:'squish', ait:[ait.aVag, ait.tRub], text:":ANAME: slips :AHIS: hand into the bottom of :TARGET:'s :TCLOTHES:, slipping a couple of fingers inside :TARGET:'s :TVAG: and massaging :THIS: insides!"});
            


            // Wearing a tentacle suit
            let tentacleSuit = C(CO.TAGS, ['a_tentacles']);
            Text.insert({conditions:[abil, tentacleSuit], ait:[ait.aGroin, ait.tTickle], sound:'slime_squish', text:":ATTACKER: lunges at :TARGET:, but is interrupted when the :TRACE:'s :TCLOTHES: begin tickling against :THIS: :TCROTCHEX:!"});
            Text.insert({conditions:[abil, tentacleSuit, C.PENIS, C(CO.TAGS, ['c_uncut'])], ait:[ait.aGroin, ait.tTickle, ait.aForeskin], sound:'slime_squish', text:"As :ATTACKER: lunges towards :TARGET:, a tendril from :TARGET:'s :TCLOTHES: slips underneath the :TRACE:'s foreskin, exploring the area and sending powerful tingles throughout :THIS: :TPENIS:!"});
            Text.insert({conditions:[abil, tentacleSuit, C.PENIS], ait:[ait.aGroin, ait.tPin], sound:'slime_squish', text:":ATTACKER: observes as a long, thin tendril from :AHIS: :TCLOTHES: slips down the tip of teh :TRACE:'s :TPENIS:! It slithers half way down before it starts gently wiggling, causing a bizarre feeling in :TARGET:'s :TPENIS:!"});
            Text.insert({conditions:[abil, tentacleSuit, C.PENIS], ait:[ait.aGroin, ait.tSqueeze], sound:'squeeze', text:":ATTACKER: goes to attack, but realizes :AHE: doesn't have to as the tendrils within :TARGET:'s :TCLOTHES: wrap tight around the :TRACE:'s :PENIS: and balls, tightening rigidly around :THIS: package!"});
            Text.insert({conditions:[abil, tentacleSuit], ait:[ait.aButt, ait.tTickle], sound:'slime_squish', text:":ATTACKER: enjoys the show as a few tendrils inside :TARGET:'s :TCLOTHES: slip between :THIS: buttcheecks and start tickling :THIM:!"});
            

            // imp
            var race_imp = C(CO.RACE, 'imp', Game.Consts.TARG_ATTACKER);
            var hydromancer = C(CO.TAGS, ['mc_hydromancer'], Game.Consts.TARG_ATTACKER);
            Text.insert({conditions:[abil, race_imp, C.A_NO_BOTTOM, C.A_PENIS], sound:'squish', ait:[ait.aMouth, ait.tPin], text:":ANAME: jumps at :TARGET:, tripping :THIM: to the ground, before :THE: realizes what has happened, the :ARACE: shoves :AHIS: :APENIS: into the :TRACE:'s mouth, humping it for a little while, and leaving a trail of demonic cum."});
            Text.insert({conditions:[abil, race_imp, C.A_NO_BOTTOM, C.A_PENIS], sound:'squish', ait:[ait.tFacial], text:":ANAME: jumps at :TARGET:, tripping :THIM: to the ground! :TARGET: recovers from the daze to see the :ARACE: standing over :THIM:, cock in hand. Before :TARGET: can react, :ATTACKER:'s :TPENIS: twitches slightly before squirting a big load of demonic jizz into the :TRACE:'s face!"});
            Text.insert({conditions:[abil, race_imp, C.A_NO_BOTTOM, C.A_PENIS], sound:'squish', ait:[ait.tFacial], text:":ANAME: shoves :TARGET: from behind, tripping :THIM: face first to the ground! The :TRACE: pushes :THIS: torso off the ground, only to be greeted by the :ARACE:'s twitching :APENIS:. Before :TARGET: can turn away, :ATTACKER: launches a stream of demonic jizz right into the :TRACE:'s face!"});
            Text.insert({conditions:[abil, race_imp, C.A_NO_BOTTOM, C.A_PENIS], sound:'squish', ait:[ait.aMouth, ait.tPin, ait.tCumInside], text:":ANAME: shoves :TARGET: from behind, tripping :THIM: face first to the ground! The :TRACE: pushes :THIS: torso off the ground, only to be greeted by the :ARACE:'s :APENIS: shoved inside :THIS: mouth! :TARGET: tries to break free, but :ATTACKER: grabs a hold of :THIS: head and forces :AHIS: :APENIS: deeper inside, thrusting until :AHE: climaxes, forcing :AHIS: demonic load down the :TRACE:'s throat!"});
            Text.insert({conditions:[abil, race_imp, C.A_NO_BOTTOM, C.A_PENIS, C.NO_BOTTOM], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: jumps at :TARGET:, tripping :THIM: to the ground, before :THE: realizes what has happened, the :ARACE: pushes :TARGET:'s legs up as :AHE: shoves :APENIS: into the :TRACE:'s :BUTT:, humping it for a little while and leaving a trail of demonic cum."});
            Text.insert({conditions:[abil, race_imp, C.A_NO_BOTTOM, C.A_PENIS, C.NO_BOTTOM, C.VAG], sound:'squish', ait:[ait.aVag, ait.tPin], text:":ANAME: jumps at :TARGET:, tripping :THIM: to the ground, before :THE: realizes what has happened, the :ARACE: shoves :AHIS: :APENIS: into the :TRACE:'s :TVAGINA:, humping it for a little while and leaving a trail of demonic cum."});
            Text.insert({conditions:[abil, race_imp, C.A_NO_BOTTOM, C.A_PENIS, C.NO_TOP, C.BREASTS], sound:'squish', ait:[ait.aBreasts, ait.tPin], text:":ANAME: jumps at :TARGET:, tripping :THIM: to the ground, before :THE: realizes what has happened, the :ARACE: jumps onto their chest and forces :AHIS: :APENIS: between the :TRACE:'s :TBREASTS:, humping for a little while and leaving demonic penis-residue between them."});
            
            Text.insert({conditions:[abil, race_imp, C.NO_BOTTOM, C.PENIS], sound:'wet_squeeze', ait:[ait.aGroin, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue around :TARGET:'s :TPENIS:, squeezing it firmly and leaving demonic saliva across the :TRACE:'s :TPENIS:!"});
            Text.insert({conditions:[abil, race_imp, C.NO_BOTTOM, C.PENIS, C(CO.TAGS, ['c_uncut'])], sound:'wet_squeeze', ait:[ait.aGroin, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue towards :TARGET:'s :TPENIS:, where it slips beneath the :TRACE:'s foreskin and hoops around, leaving demonic saliva across the :TRACE:'s glans!"});
            Text.insert({conditions:[abil, race_imp, C.NO_BOTTOM], sound:'slime_squish_bright', ait:[ait.aButt, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue between :TARGET:'s buttcheeks, causing a tingling sensation to spread across the :TRACE:'s :BUTT: and leaving a gooey streak of demonic saliva!"});
            Text.insert({conditions:[abil, race_imp, C.NO_BOTTOM], sound:'slime_squish_bright', ait:[ait.aButt, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue between :TARGET:'s buttcheeks and into :THIS: :TBUTT:, causing a tingling sensation inside of :TARGET: and leaving a gooey streak of demonic saliva as the tongue retracts!"});
            Text.insert({conditions:[abil, race_imp, C.NO_BOTTOM, C.VAG], sound:'slime_squish_bright', ait:[ait.aGroin, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue between :TARGET:'s legs and into :THIS: :TVAG:, causing a tingling sensation inside of :TARGET: and leaving a gooey streak of demonic saliva as the tongue retracts!"});
            
            Text.insert({conditions:[abil, race_imp, C.ARMOR_THONG], sound:'slime_squish_bright', ait:[ait.aButt, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue between :TARGET:'s buttcheeks, causing a tingling sensation to spread across the :TRACE:'s :BUTT: and leaving a gooey streak of demonic saliva!"});
            Text.insert({conditions:[abil, race_imp, C.ARMOR_TIGHT, C.HAS_BOTTOM, C.PENIS], sound:'slap_wet', ait:[ait.aGroin, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue across :TARGET:'s bulge, causing it to jiggle while leaving a streak of demonic saliva!"});
            Text.insert({conditions:[abil, race_imp, C.ARMOR_TIGHT, C.HAS_BOTTOM, C.VAG], sound:'slap_wet', ait:[ait.aGroin, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue between :TARGET:'s legs, rubbing demonic saliva across :THIS: :TCROTCH:!"});
            Text.insert({conditions:[abil, race_imp, C.ARMOR_TIGHT, C.BREASTS, C.HAS_TOP], sound:'slap_wet', ait:[ait.aBreasts, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue across :TARGET:'s :TBREASTS:, causing them to jiggle while leaving a streak of demonic saliva!"});
            
            Text.insert({conditions:[abil, race_imp, C.ARMOR_TIGHT, C.VAG, C(CO.TAGS, ["a_swimsuit"])], sound:'stretch', ait:[ait.aGroin, ait.tTickle], text:":ANAME: grabs a hold of the front of :TARGET:'s :TCLOTHES:, near the groin and tugs up, revealing a camel toe! :attacker: gives it a few tickles!"});
            Text.insert({conditions:[abil, race_imp, C.ARMOR_TIGHT, C.VAG, C(CO.TAGS, ["a_swimsuit"])], sound:'stretch', ait:[ait.aGroin, ait.tRub], text:":ANAME: grabs a hold of the front of :TARGET:'s :TCLOTHES:, near the groin and tugs up, revealing a camel toe! :attacker: smushes :AHIS: fingers against it and gives it a few thorough rubs!"});
            


            // Hydromancer
            Text.insert({conditions:[abil, humanoid, hydromancer, C.NO_BOTTOM], sound:'slime_squish_bright', ait:[ait.aButt, ait.aTentacle, ait.tPen, ait.tWet], text:":ANAME: summons a watery tendril between :TARGET:\'s legs, pushing up and into the :TRACE:'s :TBUTT: multiple times!"});
            Text.insert({conditions:[abil, humanoid, hydromancer, C.NO_BOTTOM, C.VAGINA], sound:'slime_squish_bright', ait:[ait.aVag, ait.aTentacle, ait.tPen, ait.tWet], text:":ANAME: summons a watery tendril between :TARGET:\'s legs, pushing up and into the :TRACE:'s :TVAGINA: multiple times!"});
            Text.insert({conditions:[abil, humanoid, hydromancer, C.NO_BOTTOM, C.PENIS], sound:'wet_squeeze', ait:[ait.aGroin, ait.aTentacle, ait.tWet, ait.tSqueeze], text:":ANAME: summons a watery tendril between :TARGET:\'s legs, wrapping itself around the :TRACE:'s :TPENIS: and rubbing it firmly!"});
            Text.insert({conditions:[abil, humanoid, hydromancer], sound:'wet_squeeze', ait:[ait.aGroin, ait.aButt, ait.tWet, ait.tTickle], text:":ANAME: summons a jet of water between :TARGET:\'s legs, the splashing water tickles :THIS: :TBUTT: and :TGROIN:!"});
            Text.insert({conditions:[abil, humanoid, hydromancer], sound:'slap_wet', ait:[ait.aButt, ait.aTentacle, ait.tWet, ait.tSlap], text:":ANAME: summons a water tendril behind :TARGET:! The tendril quickly lashes at the :TRACE:'s :TBUTT: a few times in rapid succession!"});
            Text.insert({conditions:[abil, humanoid, hydromancer, C(CO.TAGS, ['nude', 'a_thong'])], sound:'wet_squeeze', ait:[ait.aButt, ait.tWet, ait.tScratch], text:":ANAME: flings a watery glob towards :TARGET:, landing beneath :THIS: legs! A long piece of watermilfoil rises from the glob and slips in between the :TRACE:'s buttcheeks, where it starts moving in a flossing motion, sending tingles across :TARGET:'s rear!"});
            Text.insert({conditions:[abil, humanoid, hydromancer, C(CO.TAGS, ['nude', 'a_tight']), C.VAGINA], sound:'wet_squeeze', ait:[ait.aVag, ait.tWet, ait.tScratch], text:":ANAME: flings a watery glob towards :TARGET:, landing beneath :THIS: legs! A long piece of watermilfoil rises from the glob and slips in between the :TRACE:'s legs, where it starts moving in a flossing motion, sending tingles across :TARGET:'s :TGROIN:!"});
        
        //

        // NPC
            // Bite
                abil = C(CO.ABILITY, "BITE");
                Text.insert({conditions:[C(CO.ABILITY, "BITE"), C.CLOTHED], sound:'bite', ait:[ait.tBite], text:":ANAME: jumps at :TNAME:, biting at :THIS: :TCLOTHES:!"});
                Text.insert({conditions:[C(CO.ABILITY, "BITE"), C.HAS_BOTTOM], sound:'bite', ait:[ait.aButt, ait.tBite], text:":ANAME: jumps at :TNAME:, biting at the :TRACE:'s butt through :THIS: :TCLOTHES:!"});
                Text.insert({conditions:[C(CO.ABILITY, "BITE"), C.HAS_BOTTOM], sound:'stretch_snap', ait:[ait.aButt, ait.tTwang], text:":ANAME: jumps at :TNAME:, biting a hold of the back of :THIS: :TCLOTHES:! The :ARACE: pulls back before letting the garment snap back onto :TARGET:'s :BUTT:!"});
                Text.insert({conditions:[C(CO.ABILITY, "BITE"), C.HAS_BOTTOM, C.ARMOR_TIGHT], sound:'stretch_snap', ait:[ait.aGroin, ait.tTwang], text:":ANAME: jumps at :TNAME:, biting a hold of the front of the groin of :THIS: :TCLOTHES:! The :ARACE: pulls back, letting the garment snap back onto :TARGET:'s :CROTCH:!"});
                Text.insert({conditions:[C(CO.ABILITY, "BITE"), C.HAS_BOTTOM, C.ARMOR_TIGHT, C.PENIS], sound:'small_scratch', ait:[ait.aGroin, ait.tBite], text:":ANAME: jumps at :TNAME:, teeth bare! The :ARACE: manages to graze :TARGET:'s bulge with :AHIS: teeth!"});
                Text.insert({conditions:[C(CO.ABILITY, "BITE"), C.CLOTHED, C.VAG, C.BREASTS, C(CO.TAGS, "a_sling")], sound:'stretch', ait:[ait.tTwang], text:":ANAME: jumps at :TNAME:, biting a hold of the back of the :TRACE:'s sling bikini. Putting :AHIS: foot on :TARGET:'s back, the :ARACE: tugs back, wedging the garment against :THIS: :TGROIN: and :TBREASTS:!"});

            // Hydromance
                abil = C(CO.ABILITY, "HYDROMANCE");
                Text.insert({conditions:[abil, humanoid, C.CLOTHED, C.ARMOR_TIGHT], sound:'freeze', ait:[ait.aBody, ait.tCold], text:":ANAME: sends a blast of cold across :TARGET:, causing :THIS: :TCLOTHES: to freeze!"});
                Text.insert({conditions:[abil, humanoid, C.NAKED], sound:'freeze', ait:[ait.aBody, ait.tCold], text:":ANAME: sends an icy blast across :TARGET:!"});
                Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM], sound:'water_squish', ait:[ait.aButt, ait.tWet, ait.tPen], text:":ANAME: casts a spell! :TARGET: gasps as a small undulating glob of water slips up into :THIS: :TBUTT:!"});
                Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.VAGINA], sound:'water_squish', ait:[ait.aVag, ait.tWet, ait.tPen], text:":ANAME: casts a spell! :TARGET: gasps as a small undulating glob of water slips up into :THIS: :TVAGINA:!"});
                Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM, C.PENIS], sound:'water_squish', ait:[ait.aGroin, ait.tWet, ait.tTickle], text:":ANAME: summons a watery glob that slips into :TARGET:'s :TCLOTHES:! The water starts swirling around, tickling :THIS: :TCROTCHEX:."});
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM, C(CO.TAGS, ['c_uncut'])], sound:'brush_wiggle', ait:[ait.aGroin, ait.tWet, ait.tTickle, ait.aForeskin], text:":ANAME: hurls a watery glob at :TARGET:'s :TGROIN:! The :TRACE: gasps as a small length of watermilfoil slips beneath :THIS: foreskin and starts tickling against the tip of :THIS: :TPENIS:!"});
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.ARMOR_TIGHT, C.HAS_BOTTOM], sound:'brush_wiggle', ait:[ait.aGroin, ait.tWet, ait.tSqueeze], text:":ANAME: hurls a watery glob at :TARGET:'s :TGROIN:! The :TRACE: gasps as a long piece of a watery plant wraps tight around :THIS: package, squeezing a firm hold around the :TCROTCH: of :THIS: :TCLOTHES:!"});
                
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM], sound:'slime_squish_bright', ait:[ait.aGroin, ait.tWet, ait.tTickle, ait.aForeskin], text:":ANAME: hurls a watery glob at :TARGET:'s :TGROIN:! The :TRACE: gasps as a small length of watermilfoil wraps tight around :THIS: :TPENIS:, sending tingles across it as it starts wriggling!"});
                

            // Low blow, Challenger slam & PC crush
                abil = C(CO.ABILITY, ["LOW_BLOW", "CHALLENGER_SLAM", "generic_crush"]);
                Text.insert({conditions:[abil, humanoid], sound:'punch_heavy', ait:[ait.aGroin, ait.tPunch], text:":ANAME: throws a punch between :TNAME:'s legs!"});
                Text.insert({conditions:[abil, humanoid], sound:'punch_heavy', ait:[ait.aGroin, ait.tKick], text:":ANAME: throws a swift kick between :TNAME:'s legs!"});
                Text.insert({conditions:[abil, humanoid, C.BREASTS, C.HAS_TOP], sound:'punch_heavy', ait:[ait.aBreasts, ait.tPunch], text:":ANAME: throws a punch at :TNAME:'s :TBREASTS:, jiggling them around within :THIS: :TCLOTHES:"});
                Text.insert({conditions:[abil, humanoid, C.BREASTS, C.NO_TOP], sound:'punch_heavy', ait:[ait.aBreasts, ait.tPunch], text:":ANAME: throws a punch at :TNAME:'s :TBREASTS:, jiggling them around!"});
                Text.insert({conditions:[abil, humanoid, C.BREASTS], sound:'pinch', ait:[ait.aBreasts, ait.tPinch, ait.tTwist], text:":ANAME: grabs a hold of :TNAME:'s nipples, pulling forward while twisting them!"});
                Text.insert({conditions:[abil, humanoid, C.BREASTS, C.ARMOR_TIGHT, C.HAS_TOP], sound:'pinch', ait:[ait.aBreasts, ait.tPinch, ait.tTwist], text:":ANAME: grabs a hold of :TNAME:'s nipples through :THIS: :TCLOTHES:, pulling forward while twisting them!"});
                
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.HAS_BOTTOM], sound:'punch_heavy', ait:[ait.aGroin, ait.tPunch], text:":ANAME: throws a punch at :TNAME:'s :TPENIS:, jiggling :THIS: package around!"});
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM], sound:'punch_heavy', ait:[ait.aGroin, ait.tPunch], text:":ANAME: throws a punch at :TNAME:'s :TPENIS:, causing it to jiggle about!"});
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.ARMOR_TIGHT, C.HAS_BOTTOM], sound:'punch_heavy', ait:[ait.aGroin, ait.tPunch], text:":ANAME: pushes :TARGET:'s :TPENIS: up against :THIS: stomach wihin :THIS: :TCLOTHES:, then quickly throws a few punches at it!"});
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.ARMOR_TIGHT, C.HAS_BOTTOM], sound:'stretch', ait:[ait.aGroin, ait.tTwist], text:":ANAME: grabs a hold of :TARGET:'s :TPENIS: through :THIS: :TCLOTHES: before quickly twisting!"});
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM], sound:'stretch', ait:[ait.aGroin, ait.tTwist], text:":ANAME: grabs a hold of :TARGET:'s :TPENIS:, then quickly twists!"});
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.ARMOR_TIGHT, C.HAS_BOTTOM], sound:'stretch', ait:[ait.aGroin, ait.tTwist], text:":ANAME: grabs a hold of :TARGET:'s :TPENIS: through :THIS: :TCLOTHES:, then quickly twists!"});
                
                Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM], sound:'slap', ait:[ait.aGroin, ait.tSlap], text:":ANAME: slaps :TARGET:'s :TPENIS:, multiple times!"});
                Text.insert({conditions:[abil, humanoid, C.BREASTS, C.NO_TOP], sound:'slap', ait:[ait.aBreasts, ait.tSlap], text:":ANAME: slaps :TARGET:'s :TBREASTS:, multiple times!"});
                
                Text.insert({conditions:[abil, humanoid, C.ARMOR_TIGHT, C.PENIS, C.HAS_BOTTOM], sound:'stretch', ait:[ait.aGroin, ait.tSqueeze], text:":ANAME: grabs a hold of :TARGET:'s bulge through :THIS: clothes, squeezing painfully!"});
                Text.insert({conditions:[abil, humanoid, C.ARMOR_TIGHT, C.BREASTS, C.HAS_TOP], sound:'stretch', ait:[ait.aBreasts, ait.tSqueeze], text:":ANAME: grabs a hold of :TARGET:'s :TBREASTS: through :THIS: clothes, squeezing painfully!"});
                
                Text.insert({conditions:[abil, humanoid, race_imp, C.ARMOR_TIGHT, C.PENIS, C.HAS_BOTTOM], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue around :TARGET:'s bulge. Wrapping under the :TRACE:'s balls, :ATTACKER: contracts the tongue, painfully squeezing :TARGET: and leaving a mark of demonic saliva across :THIS: :CROTCH:!"});
                Text.insert({conditions:[abil, humanoid, race_imp, C.BREASTS, C.NO_TOP], sound:'wet_squeeze', ait:[ait.aBreasts, ait.tSqueeze, ait.tLick], text:":ANAME: lashes :AHIS: long demonic tongue around one of :TARGET:'s :TBREASTS:, hooping around. :ATTACKER: contracts the tongue, painfully squeezing :TARGET: and leaving a mark of demonic saliva across :THIS: :TBREASTS:!"});
                
                Text.insert({conditions:[abil, humanoid, race_imp, C.A_NO_BOTTOM, C.A_PENIS, C.NO_BOTTOM], sound:'squish', ait:[ait.aButt, ait.tCumInside, ait.tPin], text:":ANAME: lands a quick punch to :TARGET:'s throat, causing :THIM: to black out briefly! As the :TRACE: comes to, :THE: finds :THIM:self on top of :ATTACKER:, riding on :AHIS: :APENIS:. Before :TARGET: manages to get to :THIS: bearings, :THE: feels :ATTACKER:'s :APENIS: twitch as it launches a squirt of demonic jizz inside :TARGET:'s :TBUTT:!"});
                Text.insert({conditions:[abil, humanoid, race_imp, C.A_NO_BOTTOM, C.A_PENIS, C.NO_BOTTOM, C.VAG], sound:'squish', ait:[ait.aVag, ait.tCumInside, ait.tPin], text:":ANAME: lands a quick punch to :TARGET:'s throat, causing :THIM: to black out briefly! As the :TRACE: comes to, :THE: finds :THIM:self on top of :ATTACKER:, riding on :AHIS: :APENIS:. Before :TARGET: manages to get to :THIS: bearings, :THE: feels :ATTACKER:'s :APENIS: twitch as it launches a squirt of demonic jizz inside :TARGET:'s :TVAG:!"});
                
                Text.insert({conditions:[abil, humanoid, race_imp, C.ARMOR_TIGHT, C.VAG, C(CO.TAGS, ["a_swimsuit"])], sound:'slap', ait:[ait.aGroin, ait.tSlap], text:":ANAME: grabs a hold of the front of :TARGET:'s :TCLOTHES:, near the groin and tugs up, revealing a camel toe! :attacker: throws a couple of slaps at it, sending short bursts of pain through :TARGET:'s :TGROIN:!"});
            

                // Hydromancer
                Text.insert({conditions:[abil, humanoid, hydromancer, C.ARMOR_TIGHT, C.PENIS, C.HAS_BOTTOM], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze, ait.tWet], text:":ANAME: casts a glob of water towards :TARGET:'s :TGROIN:! A long piece of watermilfoil within the glob lashes beneath the :TRACE:'s balls and around :THIS: package, contracting and squeezing it painfully!"});
                Text.insert({conditions:[abil, humanoid, hydromancer, C.PENIS, C.HAS_BOTTOM], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze, ait.tWet], text:":ANAME: casts a glob of water towards :TARGET:'s :TGROIN:! A long piece of watermilfoil within the glob slips into :THIS: :TCLOTHES:, encircling :THIS: package before contracting painfully!"});
                Text.insert({conditions:[abil, humanoid, hydromancer, C.NO_BOTTOM, C.PENIS], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze, ait.tWet], text:":ANAME: casts a glob of water towards :TARGET:'s :TGROIN:! A long piece of watermilfoil within the glob encircles :THIS: package and contracts painfully!"});
                Text.insert({conditions:[abil, humanoid, hydromancer, C.PENIS], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze, ait.tWet], text:":ANAME: casts a glob of water towards :TARGET:'s :TGROIN:! A long piece of watermilfoil within the glob encircles :THIS: penis and wrings, choking the :TRACE:'s :TPENIS: tightly!"});
                Text.insert({conditions:[abil, humanoid, hydromancer], sound:'slap_wet', ait:[ait.aGroin, ait.tSlap, ait.tWet], text:":ANAME: summons a watery tendril between :TARGET:\'s legs, lashing at the :TRACE:'s :TGROIN:!"});
                Text.insert({conditions:[abil, humanoid, hydromancer, C.BREASTS], sound:'slap_wet', ait:[ait.aBreasts, ait.tSlap, ait.tWet], text:":ANAME: summons a watery tendril before :TARGET:, lashing at the :TRACE:'s :TBREASTS:!"});
                Text.insert({conditions:[abil, humanoid, hydromancer, C.NO_BOTTOM, C.PENIS], sound:'slap_wet', ait:[ait.aGroin, ait.tSlap, ait.tWet], text:":ANAME: summons a watery tendril between :TARGET:\'s legs, lashing at the :TRACE:'s :TPENIS: multiple times!"});
                

            // GRASP
                abil = C(CO.ABILITY, "GRASP");
                Text.insert({conditions:[abil, humanoid], sound:'punch_heavy', text:":ANAME: grasps :TARGET: in a vice-like grip, painfully squeezing :thim:!"});
                Text.insert({conditions:[abil, humanoid], sound:'punch_heavy', text:":ANAME: grasps :TARGET: in :AHIS: arms, lifting the :TRACE: off the ground and slamming :THIM: down with :THIS: :TGROIN: against the :ARACE:'s knee!"});
                Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_NO_BOTTOM, C.A_PENIS], sound:'squish', text:":ANAME: grasps :TARGET: in :AHIS: arms, lifting the :TRACE: off the ground and slamming :THIM: down :BUTT: first onto the :ARACE:'s :APENIS:, letting :TARGET: bounce up and down on :AHIS: length for a while!"});
                Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_NO_BOTTOM, C.A_PENIS, C.VAGINA], sound:'squish', text:":ANAME: grasps :TARGET: in :AHIS: arms, lifting the :TRACE: off the ground and slamming :THIM: down :TVAGINA: first onto the :ARACE:'s :APENIS:, letting :TARGET: bounce up and down on :AHIS: length for a while!"});
                Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_PENIS], sound:'squish', text:":ANAME: grasps :TARGET: in :AHIS: arms, lifting the :TRACE: off the ground, flipping :THIM: upside-down! :ANAME: forces :AHIS: :APENIS: into :TARGET:'s mouth and starts raising and lowering :THIM:, causing :AHIS: :APENIS: to be thrust back and forth into :TARGET:'s mouth!"});
                Text.insert({conditions:[abil, humanoid], sound:'stretch', text:":ANAME: grasps :TARGET: by the legs and lifts! The :ARACE: forces :TARGET:'s legs wide apart, causing :THIM: great pain and lifting :TARGET:'s hips towards the :ARACE:'s face. :ATTACKER: gives the struggling :TRACE: a quick lick across :THIS: :TGROIN:!"});
                Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_NO_BOTTOM, C.A_PENIS], sound:'squish', text:":ANAME: grasps :TARGET: by the legs and lifts! The :ARACE: forces :TARGET:'s legs wide apart and lifts :TARGET:'s hips towards :AHIS: own. :ATTACKER: forces :AHIS: :APENIS: inside :TARGET:'s :BUTT: and starts thrusting firmly!"});
                Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.A_NO_BOTTOM, C.A_PENIS, C.VAGINA], sound:'squish', text:":ANAME: grasps :TARGET: by the legs and lifts! The :ARACE: forces :TARGET:'s legs apart and lifts :TARGET:'s hips towards :AHIS: own. :ATTACKER: forces :AHIS: :APENIS: inside :TARGET:'s :TVAGINA: and starts thrusting firmly!"});

            


        
        //
        
        // Player abilities
            // Crush
                abil = C(CO.ABILITY, "generic_crush");
                Text.insert({conditions:[abil], sound:'punch_heavy', text:":ANAME: jumps at :TARGET:, slamming both :AHIS: fists into the :TRACE:!"});
            
            // Taunt
                abil = C(CO.ABILITY, "generic_taunt");
                Text.insert({conditions:[abil], sound:'taunt', text:":ANAME: heckles :TARGET:, preparing for :THIM: to attack!"});
                        
            // masochism
                abil = C(CO.ABILITY, "defensive_masochism");
                Text.insert({conditions:[abil], sound:'masochism', text:":ANAME: cracks :AHIS: knuckles while looking aroused at :AHIS: enemies!"});

            // Heal
                abil = C(CO.ABILITY, "support_heal");
                Text.insert({conditions:[abil], sound:'heal', text:":ANAME: casts a heal on :TARGET:!"});
            
            // Purify
                abil = C(CO.ABILITY, "support_purify");
                Text.insert({conditions:[abil], sound:'dispel_good', text:":ANAME: purifies :TARGET:!"});

            // Counter
                abil = C(CO.ABILITY, "counterAttack");
                Text.insert({conditions:[abil], sound:'punch_heavy', text:":ANAME: counter-attacks :TARGET:, dealing a large amount of damage!"});
            
            // Counter
                abil = C(CO.ABILITY, "corrupt");
                Text.insert({conditions:[abil], sound:'dark_cast', text:":ANAME: is surrounded by a dark aura!"});

            // Ghost strike
                abil = C(CO.ABILITY, "ghost_strike");
                Text.insert({conditions:[abil], sound:'darkstrike', text:":ANAME: used :AHIS: ghostly powers to strike at :TARGET:!"});

            // prism_strike
                abil = C(CO.ABILITY, "prism_strike");
                Text.insert({conditions:[abil], sound:'prismbeam', text:":ANAME: launches a prismatic beam at :TARGET:!"});

        //


        // Challenge NPCs

            // HELL BENT FOR LATEX

                // Boss A
                    // Vag fixation
                        abil = C(CO.ABILITY, "VAG_FIXATION");
                        Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tFist], sound:'squish', text:":ANAME: slips between :TNAME:'s legs, forcing :AHIS: fist up into the :TRACE:'s :TVAGINA:!"});
                        Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tFist], sound:'squish', text:":ANAME: thrusts :AHIS: hand between :TARGET:'s legs, forcing it up inside :THIS: vagina! Thrusting it in and out of the :TRACE:!"});
                        Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tPin], sound:'squish', text:":ANAME: grabs a hold of :TARGET:'s leg, lifting it up while shoving :AHIS: :APENIS: into the :TRACE:'s :TVAGINA:, thrusting it in and out of :THIM: a few times!"});
                        Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tLick], sound:'squish', text:":ANAME: slips between :TARGET:'s legs. Cocking :AHIS: neck upwards, the :ARACE: sticks :AHIS: :AMOUTH: against :TARGET:'s :TGROIN: and slips :AHIS: long tongue inside! The :TRACE: squirms as the demonic tongue swirls around inside :THIM:!"});
                        
                    //

                    // Non-Vag fixation
                        abil = C(CO.ABILITY, "NONVAG_FIXATION");
                        Text.insert({conditions:[abil, C.PENIS], sound:'squish', ait:[ait.aGroin, ait.tSqueeze], text:":ANAME: grabs a hold of :TARGET:'s exposed :TPENIS:, rubbing it sensually!"});
                        Text.insert({conditions:[abil, C.A_PENIS, C.A_NO_BOTTOM], sound:'squish', ait:[ait.aButt, ait.tPin], text:":ANAME: gets behind :TARGET: and forces :AHIS: :APENIS: up inside the :TRACE:'s :TBUTT:, thrusting into :THIM: a couple of times!"});
                        Text.insert({conditions:[abil, C.A_PENIS, C.A_NO_BOTTOM], sound:'squish', ait:[ait.aMouth, ait.tPin], text:":ANAME: jumps at :TARGET:'s head and forces :AHIS: :APENIS: into the :TRACE:'s mouth, thrusting into :THIM: a couple of times!"});
                        Text.insert({conditions:[abil, C.A_PENIS, C.A_NO_BOTTOM], sound:'squish', ait:[ait.aButt, ait.tLick], text:":ANAME: slips behind :TARGET:, pressing :AHIS: head against the :TRACE:'s :TBUTT:! :ATTACKER: pushes :AHIS: long tongue inside of the :TRACE:, forcing :THIM: to squirm as the demonic tongue swirls around inside :THIM:!"});
                        

                    //
                    
                //

                // Boss C (Succubus)
                    abil = C(CO.ABILITY, "SUCCUBUS_AURA");
                    Text.insert({conditions:[abil], ait:[], sound:'dark_aura', text:":ANAME: is surrounded by a dark aura!"});
                    
                    abil = C(CO.ABILITY, "KISS");
                    Text.insert({conditions:[abil], ait:[ait.aMouth, ait.tKiss], sound:'kiss', text:":ANAME: places a kiss on :TARGET:, lowering :THIS: defenses!"});
                    Text.insert({conditions:[abil], ait:[ait.aButt, ait.tKiss], sound:'kiss', text:":ANAME: places a kiss on :TARGET:'s :TBUTT:, lowering :THIS: defenses!"});
                    Text.insert({conditions:[abil, C.ARMOR_TIGHT, C.PENIS, C.HAS_BOTTOM], ait:[ait.aGroin, ait.tKiss], sound:'kiss', text:":ANAME: places a kiss on :TARGET:'s :TGROIN: through :THIS: :TCLOTHES:, lowering :THIS: defenses!"});
                    Text.insert({conditions:[abil, C.ARMOR_TIGHT, C.BREASTS, C.HAS_TOP], ait:[ait.aBreasts, ait.tKiss], sound:'kiss', text:":ANAME: gently kisses :TARGET:'s :TBREASTS: through :THIS: :TCLOTHES:, lowering :THIS: defenses!"});
                    Text.insert({conditions:[abil, C.NO_BOTTOM, C.PENIS], ait:[ait.aGroin, ait.tKiss], sound:'kiss', text:":ANAME: places a quick kiss at the tip of :TARGET:'s :TPENIS:, lowering :THIS: defenses!"});
                    Text.insert({conditions:[abil, C.NO_TOP, C.BREASTS], ait:[ait.aBreasts, ait.tKiss], sound:'kiss', text:":ANAME: places some quick kisses on :TARGET:'s :TBREASTS:, lowering :THIS: defenses!"});
                    Text.insert({conditions:[abil, C.NO_BOTTOM, C.VAG], ait:[ait.aVag, ait.tKiss], sound:'kiss', text:":ANAME: slips between :TARGET:'s legs and plants a kiss on the :TRACE:'s clit, lowering :THIS: defenses!"});
                    

                    abil = C(CO.ABILITY, "WHIPCRACK");
                    Text.insert({conditions:[abil], ait:[ait.aButt, ait.tWhip], sound:'whip', text:":ANAME: lashes :AHIS: whip across :TARGET:'s :TBUTT:!"});
                    Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tWhip], sound:'whip', text:":ANAME: lashes :AHIS: whip across :TARGET:'s :TGROIN:!"});
					Text.insert({conditions:[abil, C.PENIS, C.ARMOR_TIGHT, C.HAS_BOTTOM], ait:[ait.aGroin, ait.tWhip], sound:'whip', text:":ANAME: lashes :AHIS: whip across the :TGROIN: of :TARGET:'s :TCLOTHES:, smacking :THIS: bulge around!"});
					Text.insert({conditions:[abil, C.PENIS, C.NO_BOTTOM], ait:[ait.aGroin, ait.tWhip], sound:'whip', text:":ANAME: lashes :AHIS: whip across target's :TPENIS:, smacking it around!"});
					
                    Text.insert({conditions:[abil, C.BREASTS, C.ARMOR_TIGHT, C.HAS_TOP], ait:[ait.aBreasts, ait.tWhip], sound:'whip', text:":ANAME: lashes :AHIS: whip across :TARGET:'s :TBREASTS:, smacking them around within :THIS: :TCLOTHES:!"});
					Text.insert({conditions:[abil, C.BREASTS, C.NO_TOP], ait:[ait.aBreasts, ait.tWhip], sound:'whip', text:":ANAME: lashes :AHIS: whip across :TARGET:'s :TBREASTS:, smacking them around!"});
					
                //

				// Boss D (Tentacle pit)
				
					abil = C(CO.ABILITY, "TENTACLE_PIT_SUMMON");
                    Text.insert({conditions:[abil], ait:[], sound:'tentacle_summoned', text:"A large tendril arises from the ground!"});
					abil = C(CO.ABILITY, "TENTACLE_SQUEEZE");
                    Text.insert({conditions:[abil], ait:[], sound:'slime_squish', text:":ATTACKER: wraps around :TARGET:, restraining :THIM:!"});


					abil = C(CO.ABILITY, "TENTACLE_PIT_ATTACK");
                    Text.insert({conditions:[abil, humanoid], ait:[ait.aButt, ait.tWhip], sound:'slap', text:":ANAME: whaps at :TARGET:'s :TBUTT:!"});
					Text.insert({conditions:[abil, humanoid, C.BREASTS], ait:[ait.aBreasts, ait.tWhip], sound:'whip', text:":ANAME: whips across :TARGET:'s :TBREASTS:!"});
					Text.insert({conditions:[abil, humanoid, C.BREASTS, C.NO_TOP], ait:[ait.aBreasts, ait.tWhip], sound:'wet_squeeze', text:":ANAME: wraps around one of :TARGET:'s :TBREASTS:, squeezing it firmly!"});
					Text.insert({conditions:[abil, humanoid, C.BREASTS, C.NO_TOP], ait:[ait.aBreasts, ait.tSqueeze], sound:'pinch', text:":ANAME: hoops around :TARGET:'s nipples and starts tugging in various directions!"});
					Text.insert({conditions:[abil, humanoid, C.BREASTS, C.HAS_TOP], ait:[ait.aBreasts, ait.aCloth], sound:'stretch', text:":ANAME: grabs at the top of :TARGET:'s :TCLOTHES:, tugging forwards and damaging the outfit!"});
					Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM], ait:[ait.aButt, ait.aCloth], sound:'stretch', text:":ANAME: grabs at the bottom of :TARGET:'s :TCLOTHES:, tugging back and damaging the outfit!"});
					
					Text.insert({conditions:[abil, humanoid], ait:[ait.aGroin, ait.tWhip], sound:'slap', text:":ANAME: whaps at :TARGET:'s :TCROTCH:!"});
					Text.insert({conditions:[abil, humanoid, C.PENIS, C.ARMOR_TIGHT], ait:[ait.aGroin, ait.tWhip], sound:'slap', text:":ANAME: whaps the front of :TARGET:'s :TCLOTHES:, whapping :THIS: bulge around!"});
					Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM], ait:[ait.aGroin, ait.tWhip], sound:'slap', text:":ANAME: lashes multiple times across :TARGET:'s exposed :TPENIS:!"});
					
                    Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM], ait:[ait.aButt, ait.tPin], sound:'squish', text:":ANAME: manages to slip into :TARGET:'s :TCLOTHES: and find :THIS: :TBUTT:, where it quickly slips inside. The :TRACE: shuffles uncomfortably as the tendril squirms around a bit inside :THIM:!"});
                    Text.insert({conditions:[abil, humanoid, C.HAS_BOTTOM, C.VAG], ait:[ait.aGroin, ait.tPin], sound:'squish', text:":ANAME: manages to slip into :TARGET:'s :TCLOTHES: and find :THIS: :TVAG:, where it quickly slips inside. The :TRACE: shuffles uncomfortably as the tendril squirms around a bit inside :THIM:!"});
					
                    Text.insert({conditions:[abil, humanoid], ait:[ait.aGroin, ait.tRub], sound:'squish', text:":ANAME: slips between :TARGET:'s legs, allowing the gooey appendage to rub the :TRACE:'s :TGROIN:!"});
					Text.insert({conditions:[abil, humanoid, C.VAG], ait:[ait.aGroin, ait.tRub], sound:'stretch', text:":ANAME: slips between :TARGET:'s legs, briefly lifting the :TRACE: off the air and wriggling the gooey appendage against :THIS: :TCROTCH:!"});
					
                    Text.insert({conditions:[abil, humanoid, C.VAG, C.NO_BOTTOM], ait:[ait.aGroin, ait.tPin], sound:'squish', text:":ANAME: slips up between :TARGET:'s legs and up into :THIS: :TVAGINA:, landing some firm thrusts!"});
					Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM], ait:[ait.aButt, ait.tPin], sound:'squish', text:":ANAME: slips up behind :TARGET: legs and up into :THIS: :TBUTT:, landing some firm thrusts!"});
					
                    Text.insert({conditions:[abil, humanoid, C.ARMOR_TIGHT, C.PENIS], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze], text:":ANAME: slips beneath :TARGET:'s balls and up around the bulge of :THIS: :TCLOTHES:, contracting and squeezing it painfully!"});
                    Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze], text:":ANAME: slips beneath :TARGET:'s balls and up around the :THIS: :TPENIS:, contracting and squeezing :THIS: package painfully!"});
                    Text.insert({conditions:[abil, humanoid, C.PENIS, C.NO_BOTTOM], sound:'wet_squeeze', ait:[ait.aGroin, ait.tSqueeze], text:":ANAME: encircles :TARGET:'s penis and contracts, choking the :TRACE:'s :TPENIS: tightly!"});
                    
                    Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM], sound:'squish', ait:[ait.aButt, ait.tPin], text:"Two tendrils reach out from the arena and hoop around :TARGET:'s ankles, pulling them wide apart and allowing :ATTACKER: to ram itself up :TARGET:'s :TBUTT:! :ATTACKER: thrusts into the :TRACE: multiple times from below!"});
                    Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.VAG], sound:'squish', ait:[ait.aButt, ait.tPin], text:"Two tendrils reach out from the arena and hoop around :TARGET:'s ankles, pulling them wide apart and allowing :ATTACKER: to ram itself up :TARGET:'s :TVAG:! :ATTACKER: thrusts into the :TRACE: multiple times from below!"});
                    Text.insert({conditions:[abil, humanoid, C.NO_BOTTOM, C.PENIS, C(CO.TAGS, ['c_uncut']), C.NOT_GRAPPLE], sound:'squish', ait:[ait.aPenis, ait.tTickle], text:"Two tendrils grab at :TARGET:'s ankes, tripping :THIM: face first to the ground. :ATTACKER: pushes against :TARGET:'s hips, forcing :THIS: :TGROIN: towards the wriggling ground! A small tendril from the ground slips underneath :TARGET:'s foreskin, tickling :THIS: sensitive :TPENIS:!"});



					abil = C(CO.ABILITY, "TENTACLE_INJECT");
                    Text.insert({conditions:[abil, C.NO_BOTTOM], ait:[ait.aButt, ait.tPin, ait.tCumInside], sound:'slime_squish_bright', text:"A cock-tipped tentacle rises from the arena, it finds the restrained :TRACE:'s exposed :TBUTT: and forces its way inside! A few moments later, a large wad of tentacle goo squirts from the tentacle and into :TARGET:!"});
					Text.insert({conditions:[abil, C.NO_BOTTOM, C.VAG], ait:[ait.aVag, ait.tPin, ait.tCumInside], sound:'slime_squish_bright', text:"A cock-tipped tentacle rises from the arena, it finds the restrained :TRACE:'s exposed :TVAG: and forces its way inside! A few moments later, a large wad of tentacle goo squirts from the tentacle and into :TARGET:!"});
					Text.insert({conditions:[abil], ait:[ait.aMouth, ait.tPin, ait.tCumInside], sound:'slime_squish_bright', text:"A cock-tipped tentacle rises from the arena, it finds the restrained :TRACE:'s mouth and forces its way inside! A few moments later, a large wad of tentacle goo squirts from the tentacle and down :TARGET:'s throat!"});
					Text.insert({conditions:[abil, C.HAS_BOTTOM], ait:[ait.aButt, ait.tPin, ait.tCumInside], sound:'slime_squish_bright', text:"A cock-tipped tentacle rises from the arena, it slips inside the restrained :TRACE:'s :TCLOTHES: and up :THIS: :TBUTT: forcing its way inside! A few moments later, a large wad of tentacle goo squirts from the tentacle and into :TARGET:!"});
					Text.insert({conditions:[abil, C.HAS_BOTTOM, C.VAG], ait:[ait.aVag, ait.tPin, ait.tCumInside], sound:'slime_squish_bright', text:"A cock-tipped tentacle rises from the arena, it slips inside the restrained :TRACE:'s :TCLOTHES: and up :THIS: :TVAG:, forcing its way inside! A few moments later, a large wad of tentacle goo squirts from the tentacle and into :TARGET:!"});
				//    
				
                // Boss E (Yoggoth)
                    abil = C(CO.ABILITY, "YOGGOTH_SUIT");
                    Text.insert({conditions:[abil], ait:[], sound:'slime_squish', text:":ATTACKER: takes off their outfit, replacing it with a makeshift tentacle suit!"});
                    
                    
                    abil = C(CO.ABILITY, "YOGGOTH_ULTIMATE");
                    Text.insert({conditions:[abil, C.NO_BOTTOM], ait:[ait.aButt, ait.tPin], sound:'slime_squish', text:"A barrage of tentacles burst through the ground, grabbing :TARGET:'s ankles and separating them! A large tentacle is plunged deep into the :TRACE:'s :TBUTT:, thrusting violently enough that :THIS: stomach bulges slightly!"});
                    Text.insert({conditions:[abil, C.HAS_BOTTOM], ait:[ait.aButt, ait.tPin], sound:'slime_squish', text:"A barrage of tentacles burst through the ground, grabbing :TARGET:'s ankles and separating them! A large tentacle slips into :THIS: :TCLOTHES: and plunges deep inside the :TRACE:'s :TBUTT:, thrusting violently enough that :THIS: stomach bulges slightly!"});
                    Text.insert({conditions:[abil, C.NO_BOTTOM, C.VAG], ait:[ait.aButt, ait.tPin], sound:'slime_squish', text:"A barrage of tentacles burst through the ground, grabbing :TARGET:'s ankles and separating them! A large tentacle plunges deep into the :TRACE:'s :TVAG:, thrusting violently enough that :THIS: stomach bulges slightly!"});
                    Text.insert({conditions:[abil, C.HAS_BOTTOM, C.VAG], ait:[ait.aButt, ait.tPin], sound:'slime_squish', text:"A barrage of tentacles burst through the ground, grabbing :TARGET:'s ankles and separating them! A large tentacle slips into :THIS: :TCLOTHES: and plunges deep inside the :TRACE:'s :TVAG:, thrusting violently enough that :THIS: stomach bulges slightly!"});
                    Text.insert({conditions:[abil, C.NO_BOTTOM, C.PENIS], ait:[ait.aPenis, ait.tLick], sound:'slime_squish', text:"A barrage of tentacles burst through the ground, grabbing :TARGET:'s ankles and separating them! A suction cup tentacle latches tight around the :TRACE:'s :TPENIS:, little polyps inside start tickling as it sucks on :TARGET:'s :TPENIS:!"});
                    
                    
                    abil = C(CO.ABILITY, "YOGGOTH_COMMAND");
                    Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tTickle], sound:'slime_squish', text:":ATTACKER: waves a tentacle towards :TARGET:, causing :THIS: :TCLOTHES: to tickle violently against the :TRACE:'s :TCROTCHEX:!"});
                    Text.insert({conditions:[abil, C.PENIS, C(CO.TAGS, ['c_uncut'])], ait:[ait.aGroin, ait.tTickle, ait.aForeskin], sound:'slime_squish', text:":ATTACKER: waves a tentacle towards :TARGET:, causing a tendril from :AHIS: :TCLOTHES: to slip underneath the :TRACE:'s foreskin, exploring the area and sending powerful tingles throughout :THIS: :TPENIS:!"});
                    Text.insert({conditions:[abil, C.PENIS], ait:[ait.aGroin, ait.tPin], sound:'slime_squish', text:":ATTACKER: waves a tentacle towards :TARGET:, causing a long, thin tendril from :AHIS: :TCLOTHES: to slip down the tip of :THIS: :TPENIS:! It slithers half way down before it starts gently wiggling, causing a bizarre feeling in :TARGET:'s :TPENIS:!"});
                    Text.insert({conditions:[abil, C.PENIS], ait:[ait.aGroin, ait.tSqueeze], sound:'squeeze', text:":ATTACKER: waves a tentacle towards :TARGET:! The tendrils within :THIS: :TCLOTHES: wrap tight around :THIS: :PENIS: and balls, tightening rigidly around :THIS: package!"});
                    Text.insert({conditions:[abil], ait:[ait.aButt, ait.tTickle], sound:'slime_squish', text:":ATTACKER: waves a tentacle towards :TARGET:! A few tendrils inside the :TRACE:'s :TCLOTHES: slips between :THIS: buttcheecks and starts tickling :THIM:!"});
                    
                    Text.insert({conditions:[abil, C.VAG], ait:[ait.aGroin, ait.tPin], sound:'slime_squish', text:":ATTACKER: waves a tentacle towards :TARGET:, causing a few long tendrils from :THIS: :TCLOTHES: to push themselves into the :TRACE:'s :TVAG:! The tips spread inside :THIM:, rubbing all sides of :THIS: :TVAG:!"});
                    Text.insert({conditions:[abil, C.VAG], ait:[ait.aGroin, ait.tTickle], sound:'slime_squish', text:":ATTACKER: waves a tentacle towards :TARGET:, causing a tendril with a suction cup to latch onto the :TRACE:'s clit, tickling and tugging at it!"});
                    Text.insert({conditions:[abil, C.BREASTS], ait:[ait.aBreasts, ait.tTickle], sound:'slime_squish', text:":ATTACKER: waves a tentacle towards :TARGET:, causing the little tendrils inside :THIS: :TCLOTHES: to start tickling and tugging at :THIS: nipples!"});
                    Text.insert({conditions:[abil, C.BREASTS], ait:[ait.aBreasts, ait.tSqueeze], sound:'wet_squeeze', text:":ATTACKER: waves a tentacle towards :TARGET:, causing the little tendrils inside :THIS: :TCLOTHES: to wrap around :THIS: :TBREASTS:, painfully squeezing them!"});
                //
                    
                // Boss F (Jailor)
                    abil = C(CO.ABILITY, "JAILOR_SHACKLE");
                    Text.insert({conditions:[abil], ait:[], sound:'chain', text:":ATTACKER: shackles :TARGET: to the wall!"});
                    
                    abil = C(CO.ABILITY, "JAILOR_TORTURE");
                    Text.insert({conditions:[abil, C.BREASTS], ait:[ait.aBreasts, ait.tPinch], sound:'pinch', text:":ATTACKER: latches nipple clamps onto :TARGET:, briefly stinging :THIS: nipples until the :TRACE: manages to remove them!"});
                    Text.insert({conditions:[abil, C.PENIS, C.NO_BOTTOM], ait:[ait.aPenis, ait.tZap], sound:'electric_zap', text:":ATTACKER: slips an electified cock ring onto :TARGET:'s :TPENIS:! The ring sends painful shock pulses through the :TRACE:'s :TPENIS: for a few moments until :THE: manages to remove it!"});
                    Text.insert({conditions:[abil, C.BREASTS], ait:[ait.aBreasts, ait.tWhip], sound:'whip', text:":ATTACKER: lashes :AHIS: flogger across :TARGET:'s :TBREASTS:, wracking them with pain!"});
                    Text.insert({conditions:[abil], ait:[ait.aButt, ait.tWhip], sound:'whip', text:":ATTACKER: lashes :AHIS: flogger across :TARGET:'s :TBUTT:, leaving a painful mark!"});
                    Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tWhip], sound:'whip', text:":ATTACKER: lashes :AHIS: flogger across :TARGET:'s :TGROIN:, wracking the :TRACE: in pain!"});
                    
                    Text.insert({conditions:[abil], ait:[ait.aButt, ait.tZap], sound:'electric_zap', text:":ATTACKER: thrusts an electric prod towards :TARGET:, zapping :THIS: :TBUTT:!"});
                    Text.insert({conditions:[abil], ait:[ait.aGroin, ait.tZap], sound:'electric_zap', text:":ATTACKER: thrusts an electric prod towards :TARGET:, zapping :THIS: :TGROIN:!"});
                    Text.insert({conditions:[abil, C.BREASTS], ait:[ait.aBreasts, ait.tZap], sound:'electric_zap', text:":ATTACKER: thrusts an electric prod towards :TARGET: chest, zapping :THIS: :TBREASTS:!"});
                    

                    // Shackled
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.VAG], ait:[ait.aGroin, ait.tVibrate], sound:'vib', text:":ATTACKER: slips a vibrating seat between the shackled :TRACE:'s legs! Using a lever, :AHE: raises the seat, forcing :TARGET:'s feet off the ground!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.VAG, C.NO_BOTTOM], ait:[ait.aGroin, ait.tVibrate], sound:'vib', text:":ATTACKER: slips seat adorned with a vibrating dildo between the shackled :TRACE:'s legs, forcing it into :THIS: :TVAG:! Using a lever, :AHE: raises the seat, forcing :TARGET:'s feet off the ground!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.NO_BOTTOM], ait:[ait.aButt, ait.tVibrate], sound:'vib', text:":ATTACKER: slips seat adorned with a vibrating dildo between the shackled :TRACE:'s legs, forcing it into :THIS: :TBUTT:! Using a lever, :AHE: raises the seat, forcing :TARGET:'s feet off the ground!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.NO_BOTTOM], ait:[ait.aButt, ait.tZap], sound:'electric_zap', text:":ATTACKER: forces :AHIS: electric prod up the bound :TRACE:'s :TBUTT:, sending a jolt of electricity into :TARGET:!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.NO_BOTTOM, C.VAG], ait:[ait.aGroin, ait.tZap], sound:'electric_zap', text:":ATTACKER: forces :AHIS: electric prod into the bound :TRACE:'s :TVAG:, sending a jolt of electricity into :TARGET:!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.A_PENIS], ait:[ait.aMouth, ait.tPin, ait.tCumInside], sound:'squish', text:":ATTACKER: slips a ring gag into the shackled :TRACE:'s mouth, then swiftly thrusts :AHIS: :APENIS: inside! The :ARACE: humps for a while before pulling out, leaving a trail of demonic cum!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.BREASTS, C.NO_TOP], ait:[ait.aBreasts], sound:'slime_squish_bright', text:":ATTACKER: grabs a candle off the wall, then pours hot wax over the bound :TRACE:'s :TBREASTS:!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.BREASTS, C.HAS_TOP], ait:[ait.aBreasts, ait.tPinch], sound:'pinch', text:":ATTACKER: grabs at the top of :TARGET:'s :TCLOTHES: tearing the outfit out of the way and exposing :THIS: :TBREASTS:! The :ARACE: quickly positions clamps over :TARGET:'s nipples and tugs back, causing great pain to :TARGET:!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle')], ait:[ait.aBreasts, ait.tZap], sound:'electric_zap', text:":ATTACKER: slips two electrodes onto the shackled :TRACE:'s :TBREASTS:, hooks them up to a handheld controller and pushes a button! Painful jolts of electricity rapidly spread through :TARGET:'s :TBREASTS:!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.BREASTS], ait:[ait.aBreasts, ait.tSlap], sound:'slap', text:":ATTACKER: slips a piece of rope around the shackled :TRACE:'s :TBREASTS:, tying them up firmly! The sadistic :ARACE: then immediately starts slapping them around, causing :THIM: great pain!"});
                    Text.insert({conditions:[abil, C(CO.EFFECT, 'JailorShackle'), C.HAS_BOTTOM, C.ARMOR_TIGHT], ait:[ait.aGroin, ait.tZap], sound:'electric_zap', text:":ATTACKER: grabs at the back of the shackled :TRACE:'s :TCLOTHES: tugging in a way that gives :TARGET: quite a wedgie! The :ARACE: then pushes :AHIS: elctric rod against :TARGET:'s :CROTCH:, sending powerful jolts through :THIS: :TCROTCHEX:!"});
                    

                    // Confess
                    abil = C(CO.ABILITY, "JAILOR_CONFESS");
                    Text.insert({conditions:[abil], ait:[], sound:'mez', text:":ATTACKER: cracks under the torture and confesses!"});
                    

            //


        //
        


        // Punishments

            // Dominant
                abil = C(CO.ABILITY, '__PUNISHMENT_DOM__');
                Text.insert({conditions:[humanoid,a_humanoid, abil], sound:'squish', text:"This is a DOMINANT punishment placeholder"});
                Text.insert({conditions:[humanoid,a_humanoid, abil, C.A_PENIS], sound:'squish', text:":ATTACKER: lays back on the ground, :APENIS: pointing into the air, before motionining at :TARGET: to come over. Catching the drift, and not wanting to risk a disqualification, the :TRACE: does as asked, seating :THIM:self onto the :ARACE:'s :APENIS:, facing away and separating :THIS: legs. :ATTACKER: grabs a hold of :TARGET:'s wrists and immediately starts bucking :AHIS: hips, forcing the :TRACE: to bounce up and down onto :ATTACKER:'s shaft! A few minutes later, the :ARACE: finally groans and bucks :AHIS: hips up high as :AHE: plants a big load into :TARGET:'s :TBUTT:, allowing the battle to come to a conclusion!"});
                Text.insert({conditions:[humanoid,a_humanoid, abil, C.A_PENIS, C(Condition.SIZE_LESS_THAN_N, [3])], sound:'squish', text:":ANAME: saunters over to :AHIS: little victim and shoves :TARGET: to the ground. :ANAME: kneels down over the :TRACE: before shoving thier :APENIS: into :TNAME:'s mouth. Grinding deeply into them, :ANAME: moans softly as :AHE: cums into their mouth, filling it with the taste of defeat. Slowly :ANAME: gets up off of the little :TRACE:'s mouth, dribbling their fluids all over :TNAME:'s face and marking them as :AHIS: own. :TNAME: lays there defeated in more ways that one."});
                
            // Sub
                abil = C(CO.ABILITY, '__PUNISHMENT_SUB__');
                Text.insert({conditions:[humanoid,a_humanoid, abil], sound:'squish', text:"This is a SUBMISSIVE punishment placeholder"});
                
            // Sadistic
                abil = C(CO.ABILITY, '__PUNISHMENT_SAD__');
                Text.insert({conditions:[humanoid,a_humanoid, abil], sound:'squish', text:"This is a SADISTIC punishment placeholder"});
                Text.insert({conditions:[humanoid,a_humanoid, abil, C.PENIS, C(CO.NOT_TAGS, ["c_uncut"])], sound:'squish', text:":ATTACKER: picks up a remote with various buttons and a cock ring, motioning for :TARGET: to come over. The :ARACE: slips the ring over :TARGET:'s :TPENIS:, right behind the tip, and pushes a button with a lightning bolt on it. :TARGET: winces as a short burst of electricity jolts through :THIS: :TPENIS:. :ATTACKER: throws the remote into the audience, who take turns pushing the various buttons. The poor :TRACE:'s :TPENIS: is treated to a range of various settings, including rapid shock pulses, long jolts, painful squeezes as some settings cause the ring to contract, and powerful vibrations. A few minutes later, a horn sounds, signifying that the battle is over, and letting the :TRACE: remove the ring."});
                Text.insert({conditions:[humanoid,a_humanoid, abil, C.PENIS, C(CO.TAGS, ["c_uncut"])], sound:'squish', text:":ATTACKER: picks up a remote with various buttons and a cock ring, motioning for :TARGET: to come over. The :ARACE: slips the ring under :TARGET:'s foreskin, nestling it at the back, and pushes a button with a lightning bolt on it. :TARGET: winces as a short burst of electricity jolts through :THIS: :TPENIS:. :ATTACKER: throws the remote into the audience, who take turns pushing the various buttons. The poor :TRACE:'s :TPENIS: is treated to a range of various settings, including rapid shock pulses, long jolts, painful squeezes as some settings cause the ring to contract, and powerful vibrations. A few minutes later, a horn sounds, signifying that the battle is over, and letting the :TRACE: remove the ring."});
            


            // Target dummy
                Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_DOM__'), C(CO.RACE, "targetDummy")], sound:'punch', text:":ATTACKER: humps at the wooden dummy a few times. Yeah that's right you wooden bastard, owned!"});
                Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SUB__'), C(CO.RACE, "targetDummy")], sound:'squish', text:":ATTACKER: licks the wooden dummy where its crotch would have been if it had one, carefully avoiding getting splinters in :AHIS: tongue!"});
                Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SAD__'), C(CO.RACE, "targetDummy")], sound:'slap', text:":ATTACKER: slaps the wooden dummy across its \"face\". Take that you pile of wood!"});
            

			// CAMPAIGN SPECIFIC
				// Vs Tentacle pit
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_DOM__'), C.PENIS, C(CO.RACE, "tentaclePit")], sound:'squish', text:":ATTACKER: grabs a tentacle with a suction cup from the ground, slipping it over :AHIS: :APENIS: and giving the tendril a firm slap to get it going! The tendril latches on and starts sucking, receiving an occasional slap from :ATTACKER: as it slows in pace. A few minutes later, :ATTACKER: finally reaches orgasm and shoots :AHIS: load into the defeated tentacle!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_DOM__'), C(CO.RACE, "tentaclePit")], sound:'squish', text:":ATTACKER: spots a suspicious looking protrusion of the tentacle pit! :ATTACKER: shoves :AHIS: whole arm inside it, causing a screeching sound from the pit, prompting the :ARACE: to start thrusting :AHIS: fists in and out of it. A few moments later, tentacle goo starts seeping from the various limp tendrils of the defeated beast. Congratulations, you just fisted a tentacle pit!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SUB__'), C(CO.RACE, "tentaclePit")], sound:'squish', text:":ATTACKER: massages a limp tentacle to life, guiding it into :AHIS: :ABUTT:! The tentacle wiggles limply inside the :TRACE:, who grabs at the tentacle and forces it deeper inside. A few minutes of limp tentacle wriggling still manages to push :ATTACKER: to orgasm. Satisfied, :ATTACKER: prepares for the next battle!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SUB__'), C(CO.RACE, "tentaclePit"), C.A_VAG], sound:'squish', text:":ATTACKER: massages a limp tentacle to life, guiding it into :AHIS: :AVAG:! The tentacle wiggles limply inside the :TRACE:, who grabs at the tentacle and forces it deeper inside. A few minutes of limp tentacle wriggling still manages to push :ATTACKER: to orgasm. Satisfied, :ATTACKER: prepares for the next battle!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SAD__'), C(CO.RACE, "tentaclePit")], sound:'punch', text:":ATTACKER: kicks some tentacles around! Take that you stupid pit of tentacles and fail!"});
					
				// By tentacle pit
	
					let pit = C(CO.RACE, "tentaclePit", Game.Consts.TARG_ATTACKER);

					// SADISTIC
					Text.insert({
						conditions:[C(CO.ABILITY, '__PUNISHMENT_SAD__'), pit], sound:'whip', 
						text:"A large tentacle rises from the arena and slides a hoop around :TARGET:, restraining :THIM:! Without warning, two more tendrils lash out and begin smacking the :TRACE:'s :TBUTT:, making :THIM: wince in pain! The lashings don't stop for many minutes, leaving :TARGET:'s :TBUTT: stinging heavily as it lets :THIM: fall defeated to the ground."
					});
					Text.insert({
						conditions:[C(CO.ABILITY, '__PUNISHMENT_SAD__'), pit], sound:'whip', 
						text:"A large tentacle rises from the arena and slides a hoop around :TARGET:, restraining :THIM:! Without warning, two more tendrils lash out and begin smacking the :TRACE:'s :TBUTT:, making :THIM: wince in pain! The lashings don't stop for many minutes, leaving :TARGET:'s :TBUTT: stinging heavily as it lets :THIM: fall defeated to the ground."
					});

                    // SUB/DOM are the same
					Text.insert({
						conditions:[C(CO.ABILITY, ['__PUNISHMENT_DOM__', '__PUNISHMENT_SUB__']), pit], sound:'squish', 
						text:"A tentacle lashes out and grabs a hold of :TARGET:'s waist. It lifts :THIM: into the air while two more tendril spread the :TRACE:'s legs, allowing a sturdy tentacles to force its way inside :THIS: :TBUTT:! The tentacle starts thrusting violently in and out of :TARGET:, prodding at every inch inside :THIM:. Another small tentacle slips across :THIS: :TCROTCHEX:, tickling gently. The violation goes on a few minutes until the :TRACE: reaches :THIS: climax, shortly followed by being dropped onto the wet ground, defeated."
					});
                    Text.insert({
						conditions:[C(CO.ABILITY, ['__PUNISHMENT_DOM__', '__PUNISHMENT_SUB__']), pit, C.VAG], sound:'squish', 
						text:"A tentacle lashes out and grabs a hold of :TARGET:'s waist. It lifts :THIM: into the air while two more tendril spread the :TRACE:'s legs, allowing a sturdy tentacles to force its way inside :THIS: :TVAG:! The tentacle starts thrusting violently in and out of :TARGET:, prodding at every inch inside :THIM:. Another small tentacle slips between :THIS: buttcheeks, tickling gently. The violation goes on a few minutes until the :TRACE: reaches :THIS: climax, shortly followed by being dropped onto the wet ground, defeated."
					});
                    Text.insert({
						conditions:[C(CO.ABILITY, ['__PUNISHMENT_DOM__', '__PUNISHMENT_SUB__']), pit, C.VAG], sound:'squish', 
						text:"Before :TARGET: can properly react to the end of the battle, a large tendril ceases :TARGET: and slams :THIM: onto :THIS: back against the wriggling floor! Smaller tendrils reach in towards the :TRACE: lifting :THIS: legs into the air and forcefully spreading them. A long penis-tipped tentacle plunges into :TARGET:'s :TVAG: and starts thrusting furiously. Another tendril just like it presses itself inside :TARGET:'s mouth, where it too starts thrusting, grinding against :THIS: cheeks. A few minutes later, the tentacles give a final sturdy thrust in sync as they force a thick gooey liquid inside both of :TARGET:'s orifices. Finally the tentacles retract, the mouth-focused one leaving a few streaks of green tentacle liquid across the :TRACE:'s face, and allowing the battle to draw to a conclusion."
					});
                    Text.insert({
						conditions:[C(CO.ABILITY, ['__PUNISHMENT_DOM__', '__PUNISHMENT_SUB__']), pit, C.PENIS], sound:'squish', 
						text:"Before :TARGET: can properly react to the end of the battle, a large tendril ceases :TARGET: and slams :THIM: face first against the wriggling floor! Smaller tendrils reach in towards the :TRACE: separating :THIS: legs and exposing :THIS: :TBUTT: while forcing :THIS: :TPENIS: against the wrigging ground. A long penis-tipped tentacle plunges into :TARGET:'s :TBUTT: and starts thrusting furiously. Another tendril just like it presses itself inside :TARGET:'s mouth, where it too starts thrusting, grinding against :THIS: cheeks. A few minutes later, the tentacles give a final sturdy thrust in sync as they force a thick gooey liquid inside both of :TARGET:'s orifices. Finally the tentacles retract, the mouth-focused squirting a few dollops of green tentacle liquid across the :TRACE:'s face."
					});
                    
                // Vs Yoggoth
                    Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SAD__'), C(CO.RACE, "yoggoth")], sound:'squish', text:":ATTACKER: jumps on :TARGET:, pinning :THIM: to the ground! The :ARACE: grabs a hold of the :TRACE:'s neck and pushes :AHIS: fist to :THIS: head, giving the tentacle beast a noogie!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_DOM__'), C(CO.RACE, "yoggoth"), C.VAG], sound:'squish', text:":ATTACKER: jumps on :TARGET:, pinning :THIM: to the ground! The :ARACE: slips onto the :TRACE:'s face, grinding :AHIS: :AVAG: against the beast's tentacle face!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_DOM__'), C(CO.RACE, "yoggoth"), C.PENIS], sound:'squish', text:":ATTACKER: jumps on :TARGET:, pinning :THIM: to the ground! The :ARACE: shoves :AHIS: :APENIS: into the beast's tentacle face, humping into the wriggling mass! Eventuall, :ATTACKER: reaches climax and shoots :AHIS: load into the already sticky lump of tentacles!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SUB__'), C(CO.RACE, "yoggoth"), C.VAG], sound:'squish', text:":ATTACKER: jumps on :TARGET:, pinning :THIM: to the ground and positining :AHIM:self over the :TRACE:'s tentacle-:TPENIS:! :ATTACKER: allows the impressive :TPENIS: to slide up inside :AHIS: :AVAG:, filling :AHIM: up! The victorious :ARACE: starts grinding back and forth as the gooey appendage wiggles about inside :AHIM:, riding for long enough to achieve orgasm!"});
					Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SUB__'), C(CO.RACE, "yoggoth"), C.PENIS], sound:'squish', text:":ATTACKER: jumps on :TARGET:, pinning :THIM: to the ground and positining :AHIM:self over the :TRACE:'s tentacle-:TPENIS:! :ATTACKER: allows the impressive :TPENIS: to slide up inside :AHIS: :ABUTT:, slitering deep inside! The victorious :ARACE: starts grinding back and forth as the gooey appendage wiggles about inside :AHIM:, riding for long enough to hit orgasm, shooting :AHIS: load across the defeated :TRACE:'s chest!"});
					
				// By yoggoth
                    pit = C(CO.RACE, "yoggoth", Game.Consts.TARG_ATTACKER);
                    Text.insert({conditions:[C(CO.ABILITY, '__PUNISHMENT_SAD__'), pit], sound:'squish', text:":ATTACKER: slithers :AHIS: tentacled arms around :TARGET:'s waist, pushing it forwards and exposing :THIS: :TBUTT:! With :AHIS: victim locked in place, the :ARACE: starts whapping the :TRACE:'s :TBUTT: with :AHIS: slimy arms! A while later, the :ARACE: drops :TARGET: to the floor, leaving :THIM: with slimy streaks across :THIS: stinging :TBUTT:!"});
					
                    Text.insert({conditions:[C(CO.ABILITY, ['__PUNISHMENT_DOM__','__PUNISHMENT_SUB__']), pit, C.PENIS], sound:'squish', text:":ATTACKER: slithers :AHIS: tentacled arms around :TARGET:'s waist, lifting :THIM: onto :AHIS: face! Some of :AHIS: face tendrils wrap around :TARGET:'s :TPENIS:, squeezing it firmly, while another thicker tentacles slithers its way into the :TRACE:'s :TBUTT:! :ATTACKER: resumes the violation, holding :TARGET: up like a prize on :THIS: shoulders for everyone to see. Eventually :TARGET: cums, the droplets of spunk being absorbed into the :ARACE:'s gooey appendages. :ATTACKER: returns the favor by having the rear tentacle squirt a large glob of sticky slime up into :TARGET:'s :TBUTT:, before dropping :THIM: to the ground!"});
					Text.insert({conditions:[C(CO.ABILITY, ['__PUNISHMENT_DOM__','__PUNISHMENT_SUB__']), pit, C.VAG], sound:'squish', text:":ATTACKER: slithers :AHIS: tentacled arms around :TARGET:'s waist, lifting :THIM: onto :AHIS: face! A couple of tentacles from :AHIS: face slither their way into the :TRACE:'s :TVAG:! :ATTACKER: resumes the violation, holding :TARGET: up like a prize on :THIS: shoulders for everyone to see. Eventually :TARGET: nears climax, prompting the tendrils inside the :TRACE: to squirt a fair load of sticky slime into :TARGET:, coating :THIS: inside with goo before dropping :THIM: to the ground!"});
					

        //




    };



})();
