(define (problem scene1)
  (:domain manip)
  (:objects
    bunch of red grapes - item
    tomato - item
    green lime_1 green lime_2 - item
    steel knife - item
    orange bowl - container
    orange lid - lid
  )
  (:init
    (ontable bunch of red grapes)
    (ontable tomato)
    (ontable green lime_1)
    (ontable green lime_2)
    (ontable steel knife)
    (closed orange bowl)
    (on orange lid orange bowl)
    (clear bunch of red grapes)
    (clear tomato)
    (clear green lime_1)
    (clear green lime_2)
    (clear steel knife)
    (handempty)
  )
  (:goal (and ))
)